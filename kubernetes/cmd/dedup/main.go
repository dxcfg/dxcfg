package main

import (
	"bytes"
	"io"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/Masterminds/semver"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatal("Usage: dedup src dest")
	}

	src, dest := os.Args[1], os.Args[2]
	log.Print("Copying schemas from src ", src, " to dest ", dest)

	// Go through all the directories src/*-local in semver order, and
	// construct like-named directories in dest but with duplicated
	// files as symlinks back to a prior version.

	dirs, err := filepath.Glob(filepath.Join(src, "v*-local"))
	if err != nil {
		log.Fatal(err)
	}

	versionDir := func(v *semver.Version) string {
		return "v" + v.String() + "-local"
	}

	vs := make([]*semver.Version, len(dirs))
	for i, d := range dirs {
		r := filepath.Base(d)
		r = strings.TrimSuffix(r, "-local")
		v, err := semver.NewVersion(r)
		if err != nil {
			log.Fatalf("Error parsing version '%s': %s", r, err)
		}
		vs[i] = v
	}
	sort.Sort(semver.Collection(vs))

	first, rest := vs[0], vs[1:]

	vdir := versionDir(first)
	files, err := filepath.Glob(filepath.Join(src, vdir, "*.json"))
	if err != nil {
		log.Fatal(err)
	}

	destdir := filepath.Join(dest, vdir)
	if err = os.MkdirAll(destdir, os.FileMode(0777)); err != nil {
		log.Fatal(err)
	}
	log.Printf("Transferring %d files from %s to %s", len(files), filepath.Join(src, vdir), destdir)
	for _, f := range files {
		b := filepath.Base(f)
		if err := copy(filepath.Join(destdir, b), f); err != nil {
			log.Fatal(err)
		}
	}

	for _, v := range rest {
		vdir := versionDir(v)
		destdir := filepath.Join(dest, vdir)
		if err := os.MkdirAll(destdir, os.FileMode(0777)); err != nil {
			log.Fatal(err)
		}

		files, err := filepath.Glob(filepath.Join(src, vdir, "*.json"))
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("Transferring %d files from %s to %s", len(files), filepath.Join(src, vdir), destdir)

		var copiedCount, linkedCount int
		for _, f := range files {
			b := filepath.Base(f)
			compare := filepath.Join(dest, versionDir(first), b)
			linked, err := copyOrSymlink(filepath.Join(destdir, b), f, compare)
			if err != nil {
				log.Fatal(err)
			}
			if linked {
				linkedCount++
			} else {
				copiedCount++
			}
		}
		log.Printf("Linked %d, copied %d from %s to %s", linkedCount, copiedCount, first.String(), v.String())

		first = v
	}
}

func copy(dest, src string) error {
	destfile, err := os.Create(dest)
	if err != nil {
		return err
	}
	defer destfile.Close()
	srcfile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcfile.Close()
	_, err = io.Copy(destfile, srcfile)
	return err
}

// either copy src to dest, or if src is the same as compare, symlink
// it. returns true if symlinked, false if copied
func copyOrSymlink(dest, src, compare string) (bool, error) {
	srcstat, err := os.Stat(src)
	if err != nil {
		return false, err
	}
	comparestat, err := os.Stat(compare)
	if err != nil {
		return false, copy(dest, src)
	}

	// quick check: if the files aren't the same size, they can't be the same
	if srcstat.Size() != comparestat.Size() {
		return false, copy(dest, src)
	}

	// otherwise, check the contents
	srcbytes, err := ioutil.ReadFile(src)
	if err != nil {
		return false, err
	}
	comparebytes, err := ioutil.ReadFile(compare)
	if err != nil {
		return false, err
	}
	if bytes.Compare(srcbytes, comparebytes) == 0 {
		lstat, err := os.Lstat(compare)
		if err != nil {
			return true, err
		}
		var oldname string
		if lstat.Mode()&os.ModeSymlink != 0 {
			// since we do this each time, no need to chase it down
			oldname, err = os.Readlink(compare)
			if err != nil {
				return true, err
			}
		} else {
			// This is a bit of a cheat (we could pass the versions in
			// instead?). Anyway, the symlink must be relative, so
			// that it will survive being transplanted into an image
			oldname = filepath.Join("..", filepath.Base(filepath.Dir(compare)), filepath.Base(compare))
		}
		return true, os.Symlink(oldname, dest)
	}
	return false, copy(dest, src)
}
