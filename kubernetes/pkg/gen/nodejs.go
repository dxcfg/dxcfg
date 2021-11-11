// Copyright 2016-2018, Pulumi Corporation.
// Copyright 2018, The jk Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package gen

import (
	"fmt"

	"github.com/cbroglie/mustache"
)

// --------------------------------------------------------------------------

// Main interface.

// --------------------------------------------------------------------------

// NodeJSClient will generate a Pulumi Kubernetes provider client SDK for nodejs.
func NodeJSClient(
	swagger map[string]interface{}, templateDir string,
) (inputsts, providerts string, err error) {
	definitions := swagger["definitions"].(map[string]interface{})

	groupsSlice := createGroups(definitions, shapesOpts())
	inputsts, err = mustache.RenderFile(fmt.Sprintf("%s/shapes.ts.mustache", templateDir),
		map[string]interface{}{
			"Groups": groupsSlice,
		})
	if err != nil {
		return "", "", err
	}

	groupsSlice = createGroups(definitions, apiOpts())
	providerts, err = mustache.RenderFile(fmt.Sprintf("%s/api.ts.mustache", templateDir),
		map[string]interface{}{
			"Groups": groupsSlice,
		})
	if err != nil {
		return "", "", err
	}

	return inputsts, providerts, nil
}
