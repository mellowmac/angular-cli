/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Rule } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '../../utility/dependencies';
import { latestVersions } from '../../utility/latest-versions';

export function updateDependencies(): Rule {
  return host => {
    const dependenciesToUpdate: Record<string, string> = {
      '@angular-devkit/build-angular': latestVersions.DevkitBuildAngular,
      '@angular-devkit/build-ng-packagr': latestVersions.DevkitBuildNgPackagr,
      '@angular-devkit/build-webpack': latestVersions.DevkitBuildWebpack,
      'zone.js': latestVersions.ZoneJs,
      'ng-packagr': latestVersions.ngPackagr,
      'web-animations-js': '^2.3.2',
      'codelyzer': '^5.1.2',
    };

    for (const [name, version] of Object.entries(dependenciesToUpdate)) {
      const current = getPackageJsonDependency(host, name);
      if (!current || current.version === version) {
        continue;
      }

      addPackageJsonDependency(host, {
        type: current.type,
        name,
        version,
        overwrite: true,
      });
    }

    // `@angular/pwa` package is only needed when running `ng-add`.
    removePackageJsonDependency(host, '@angular/pwa');
  };
}
