[//]: # (title: 멀티플랫폼 Gradle DSL 참조)

Kotlin 멀티플랫폼 Gradle 플러그인은 Kotlin 멀티플랫폼 프로젝트를 생성하기 위한 도구입니다. 이 문서는 해당 내용에 대한 참조를 제공하므로, Kotlin 멀티플랫폼 프로젝트용 Gradle 빌드 스크립트를 작성할 때 이를 참고하여 활용할 수 있습니다. [Kotlin 멀티플랫폼 프로젝트의 개념, 생성 및 구성 방법](multiplatform-discover-project.md)에 대해 알아보세요.

## ID 및 버전

Kotlin 멀티플랫폼 Gradle 플러그인의 정규화된 이름은 `org.jetbrains.kotlin.multiplatform`입니다. Kotlin Gradle DSL을 사용하는 경우, `kotlin("multiplatform")`으로 플러그인을 적용할 수 있습니다. 플러그인 버전은 Kotlin 릴리스 버전과 일치합니다. 최신 버전은 %kotlinVersion%입니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</tab>
</tabs>

## 최상위 블록

`kotlin {}`은 Gradle 빌드 스크립트에서 멀티플랫폼 프로젝트 구성을 위한 최상위 블록입니다. `kotlin {}` 내부에는 다음 블록들을 작성할 수 있습니다.

| **블록**            | **설명**                                                                                                                               |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 프로젝트의 특정 타겟을 선언합니다. 사용 가능한 타겟 이름은 [타겟](#targets) 섹션에 나열되어 있습니다.                                            |
| `targets`            | 프로젝트의 모든 타겟을 나열합니다.                                                                                                        |
| `sourceSets`         | 프로젝트의 미리 정의된 소스 세트와 사용자 지정 [소스 세트](#source-sets)를 구성 및 선언합니다.                                            |
| `compilerOptions`    | 모든 타겟과 공유 소스 세트의 기본값으로 사용되는 공통 확장 수준 [컴파일러 옵션](#compiler-options)을 지정합니다. |

## 타겟

_타겟_은 지원되는 플랫폼 중 하나를 대상으로 하는 소프트웨어를 컴파일, 테스트 및 패키징하는 역할을 하는 빌드의 일부입니다. Kotlin은 각 플랫폼에 대한 타겟을 제공하므로, Kotlin이 해당 특정 타겟에 대한 코드를 컴파일하도록 지시할 수 있습니다. [타겟 설정](multiplatform-discover-project.md#targets)에 대해 자세히 알아보세요.

각 타겟은 하나 이상의 [컴파일](#compilations)을 가질 수 있습니다. 테스트 및 프로덕션 목적을 위한 기본 컴파일 외에도 [사용자 지정 컴파일을 생성](multiplatform-configure-compilations.md#create-a-custom-compilation)할 수 있습니다.

멀티플랫폼 프로젝트의 타겟은 `kotlin {}` 내부의 해당 블록(예: `jvm`, `androidTarget`, `iosArm64`)에 설명되어 있습니다. 사용 가능한 타겟의 전체 목록은 다음과 같습니다.

<table>
    <tr>
        <th>타겟 플랫폼</th>
        <th>타겟</th>
        <th>설명</th>
    </tr>
    <tr>
        <td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
    </tr>
    <tr>
        <td rowspan="2">Kotlin/Wasm</td>
        <td><code>wasmJs</code></td>
        <td>JavaScript 런타임에서 프로젝트를 실행할 계획이라면 사용하세요.</td>
    </tr>
    <tr>
        <td><code>wasmWasi</code></td>
        <td><a href="https://github.com/WebAssembly/WASI">WASI</a> 시스템 인터페이스 지원이 필요한 경우 사용하세요.</td>
    </tr>
    <tr>
        <td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>실행 환경을 선택하세요:</p>
            <list>
                <li><code>browser {}</code>는 브라우저에서 실행되는 애플리케이션용입니다.</li>
                <li><code>nodejs {}</code>는 Node.js에서 실행되는 애플리케이션용입니다.</li>
            </list>
            <p><a href="https://kotlinlang.org/docs/js-project-setup.html#execution-environments">Kotlin/JS 프로젝트 설정</a>에서 자세히 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>Kotlin/Native</td>
        <td></td>
        <td>
            <p><a href="https://kotlinlang.org/docs/native-target-support.html">Kotlin/Native 타겟 지원</a>에서 macOS, Linux 및 Windows 호스트에 대해 현재 지원되는 타겟에 대해 알아보세요.</p>
        </td>
    </tr>
    <tr>
        <td>Android 애플리케이션 및 라이브러리</td>
        <td><code>androidTarget</code></td>
        <td>
            <p>Android Gradle 플러그인(`com.android.application` 또는 `com.android.library`)을 수동으로 적용하세요.</p>
            <p>Gradle 서브프로젝트당 하나의 Android 타겟만 생성할 수 있습니다.</p>
        </td>
    </tr>
</table>

> 현재 호스트에서 지원되지 않는 타겟은 빌드 중에 무시되므로 게시되지 않습니다.
>
{style="note"}

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

타겟의 구성은 두 가지 부분을 포함할 수 있습니다.

*   모든 타겟에서 사용 가능한 [공통 구성](#common-target-configuration).
*   타겟별 구성.

각 타겟은 하나 이상의 [컴파일](#compilations)을 가질 수 있습니다.

### 공통 타겟 구성

모든 타겟 블록에서 다음 선언을 사용할 수 있습니다.

| **이름**            | **설명**                                                                                                                                                                           |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 이 타겟의 Kotlin 플랫폼입니다. 사용 가능한 값: `jvm`, `androidJvm`, `js`, `wasm`, `native`, `common`.                                                                              |
| `artifactsTaskName` | 이 타겟의 결과 아티팩트를 빌드하는 태스크의 이름입니다.                                                                                                                   |
| `components`        | Gradle 게시(publication)를 설정하는 데 사용되는 구성 요소입니다.                                                                                                                                             |
| `compilerOptions`   | 타겟에 사용되는 [컴파일러 옵션](#compiler-options)입니다. 이 선언은 [최상위](multiplatform-dsl-reference.md#top-level-blocks)에 구성된 모든 `compilerOptions {}`를 재정의합니다. |

### 웹 타겟

`js {}` 블록은 Kotlin/JS 타겟의 구성을 설명하고, `wasmJs {}` 블록은 JavaScript와 상호 운용되는 Kotlin/Wasm 타겟의 구성을 설명합니다. 이들은 타겟 실행 환경에 따라 다음 두 블록 중 하나를 포함할 수 있습니다.

| **이름**              | **설명**                      |
|-----------------------|--------------------------------------|
| [`browser`](#browser) | 브라우저 타겟의 구성. |
| [`nodejs`](#node-js)  | Node.js 타겟의 구성. |

[Kotlin/JS 프로젝트 구성](https://kotlinlang.org/docs/js-project-setup.html)에 대해 자세히 알아보세요.

별도의 `wasmWasi {}` 블록은 WASI 시스템 인터페이스를 지원하는 Kotlin/Wasm 타겟의 구성을 설명합니다. 여기서는 [`nodejs`](#node-js) 실행 환경만 사용 가능합니다.

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

모든 웹 타겟(`js`, `wasmJs`, `wasmWasi`)은 `binaries.executable()` 호출을 지원합니다. 이는 Kotlin 컴파일러가 실행 파일을 출력하도록 명시적으로 지시합니다. 자세한 내용은 Kotlin/JS 문서의 [실행 환경](https://kotlinlang.org/docs/js-project-setup.html#execution-environments)을 참조하세요.

#### 브라우저

`browser {}`는 다음 구성 블록을 포함할 수 있습니다.

| **이름**       | **설명**                                                            |
|----------------|----------------------------------------------------------------------------|
| `testRuns`     | 테스트 실행 구성.                                           |
| `runTask`      | 프로젝트 실행 구성.                                          |
| `webpackTask`  | [Webpack](https://webpack.js.org/)을 사용한 프로젝트 번들링(bundling) 구성. |
| `distribution` | 출력 파일 경로.                                                      |

```kotlin
kotlin {
    js().browser {
        webpackTask { /* ... */ }
        testRuns { /* ... */ }
        distribution {
            directory = File("$projectDir/customdir/")
        }
    }
}
```

#### Node.js

`nodejs {}`는 테스트 및 실행 태스크의 구성을 포함할 수 있습니다.

| **이름**   | **설명**                   |
|------------|-----------------------------------|
| `testRuns` | 테스트 실행 구성.  |
| `runTask`  | 프로젝트 실행 구성. |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### 네이티브 타겟

네이티브 타겟의 경우, 다음 특정 블록들을 사용할 수 있습니다.

| **이름**    | **설명**                                          |
|-------------|----------------------------------------------------------|
| `binaries`  | 생성할 [바이너리](#binaries) 구성.       |
| `cinterops` | [C 라이브러리와의 상호 운용](#cinterops) 구성. |

#### 바이너리

다음 종류의 바이너리가 있습니다.

| **이름**     | **설명**        |
|--------------|------------------------|
| `executable` | 제품 실행 파일.    |
| `test`       | 테스트 실행 파일.       |
| `sharedLib`  | 공유 라이브러리.        |
| `staticLib`  | 정적 라이브러리.        |
| `framework`  | Objective-C 프레임워크. |

```kotlin
kotlin {
    linuxX64 { // 필요한 타겟으로 교체하세요.
        binaries {
            executable {
                // 바이너리 구성.
            }
        }
    }
}
```

바이너리 구성에는 다음 매개변수들을 사용할 수 있습니다.

| **이름**      | **설명**                                                                                                                                                   |
|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 바이너리가 빌드되는 컴파일입니다. 기본적으로 `test` 바이너리는 `test` 컴파일을 기반으로 하며, 다른 바이너리는 `main` 컴파일을 기반으로 합니다. |
| `linkerOpts`  | 바이너리 빌드 중 시스템 링커에 전달되는 옵션입니다.                                                                                                         |
| `baseName`    | 출력 파일의 사용자 지정 기본 이름입니다. 최종 파일 이름은 이 기본 이름에 시스템 종속적인 접두사와 접미사를 추가하여 형성됩니다.                         |
| `entryPoint`  | 실행 바이너리의 진입점 함수입니다. 기본적으로 루트 패키지의 `main()`입니다.                                                                  |
| `outputFile`  | 출력 파일에 대한 접근.                                                                                                                                        |
| `linkTask`    | 링크 태스크에 대한 접근.                                                                                                                                          |
| `runTask`     | 실행 바이너리의 실행 태스크에 대한 접근. `linuxX64`, `macosX64`, `mingwX64` 이외의 타겟에서는 값이 `null`입니다.                                 |
| `isStatic`    | Objective-C 프레임워크용. 동적 라이브러리 대신 정적 라이브러리를 포함합니다.                                                                                   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 테스트 컴파일을 기반으로 바이너리를 빌드합니다.
        compilation = compilations["test"]

        // 링커를 위한 사용자 지정 명령줄 옵션.
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 출력 파일의 기본 이름.
        baseName = "foo"

        // 사용자 지정 진입점 함수.
        entryPoint = "org.example.main"

        // 출력 파일에 접근합니다.
        println("Executable path: ${outputFile.absolutePath}")

        // 링크 태스크에 접근합니다.
        linkTask.dependsOn(additionalPreprocessingTask)

        // 실행 태스크에 접근합니다.
        // 호스트가 아닌 플랫폼의 경우 runTask는 null입니다.
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 동적 라이브러리 대신 정적 라이브러리를 프레임워크에 포함합니다.
        isStatic = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 테스트 컴파일을 기반으로 바이너리를 빌드합니다.
        compilation = compilations.test

        // 링커를 위한 사용자 지정 명령줄 옵션.
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 출력 파일의 기본 이름.
        baseName = 'foo'

        // 사용자 지정 진입점 함수.
        entryPoint = 'org.example.main'

        // 출력 파일에 접근합니다.
        println("Executable path: ${outputFile.absolutePath}")

        // 링크 태스크에 접근합니다.
        linkTask.dependsOn(additionalPreprocessingTask)

        // 실행 태스크에 접근합니다.
        // 호스트가 아닌 플랫폼의 경우 runTask는 null입니다.
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // 동적 라이브러리 대신 정적 라이브러리를 프레임워크에 포함합니다.
        isStatic = true
    }
}
```

</tab>
</tabs>

[네이티브 바이너리 빌드](multiplatform-build-native-binaries.md)에 대해 자세히 알아보세요.

#### Cinterops

`cinterops`는 네이티브 라이브러리와의 상호 운용(interop)에 대한 설명 모음입니다. 라이브러리와의 상호 운용을 제공하려면 `cinterops`에 항목을 추가하고 해당 매개변수를 정의하세요.

| **이름**         | **설명**                                       |
|------------------|-------------------------------------------------------|
| `definitionFile` | 네이티브 API를 설명하는 `.def` 파일.            |
| `packageName`    | 생성된 Kotlin API의 패키지 접두사.          |
| `compilerOpts`   | cinterop 도구에 의해 컴파일러에 전달될 옵션. |
| `includeDirs`    | 헤더를 찾을 디렉토리.                      |
| `header`         | 바인딩에 포함될 헤더.                               |
| `headers`        | 바인딩에 포함될 헤더 목록.                   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 필요한 타겟으로 교체하세요.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 네이티브 API를 설명하는 정의 파일.
                // 기본 경로는 src/nativeInterop/cinterop/<interop-name>.def입니다.
                definitionFile.set(project.file("def-file.def"))

                // 생성된 Kotlin API를 배치할 패키지.
                packageName("org.sample")

                // cinterop 도구에 의해 컴파일러에 전달될 옵션.
                compilerOpts("-Ipath/to/headers")

                // 헤더 검색을 위한 디렉토리(-I<path> 컴파일러 옵션의 아날로그).
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders의 단축.
                includeDirs("include/directory", "another/directory")

                // 바인딩에 포함될 헤더 파일.
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 필요한 타겟으로 교체하세요.
        compilations.main {
            cinterops {
                myInterop {
                    // 네이티브 API를 설명하는 정의 파일.
                    // 기본 경로는 src/nativeInterop/cinterop/<interop-name>.def입니다.
                    definitionFile = project.file("def-file.def")

                    // 생성된 Kotlin API를 배치할 패키지.
                    packageName 'org.sample'

                    // cinterop 도구에 의해 컴파일러에 전달될 옵션.
                    compilerOpts '-Ipath/to/headers'

                    // 헤더 검색을 위한 디렉토리(-I<path> 컴파일러 옵션의 아날로그).
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders의 단축.
                    includeDirs("include/directory", "another/directory")

                    // 바인딩에 포함될 헤더 파일.
                    header("path/to/header.h")
                    headers("path/to/header1.h", "path/to/header2.h")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</tab>
</tabs>

더 많은 cinterop 속성은 [정의 파일](https://kotlinlang.org/docs/native-definition-file.html#properties)을 참조하세요.

### Android 타겟

Kotlin 멀티플랫폼 플러그인은 Android 타겟용 [빌드 베리언트](https://developer.android.com/studio/build/build-variants)를 구성하는 데 도움이 되는 특정 함수를 가지고 있습니다.

| **이름**                      | **설명**                                                                                                                                      |
|-------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 게시할 빌드 베리언트를 지정합니다. [Android 라이브러리 게시](multiplatform-publish-lib-setup.md#publish-an-android-library)에 대해 자세히 알아보세요. |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

[Android용 컴파일](multiplatform-configure-compilations.md#compilation-for-android)에 대해 자세히 알아보세요.

> `kotlin {}` 블록 내부의 `androidTarget` 구성은 어떤 Android 프로젝트의 빌드 구성도 대체하지 않습니다. [Android 개발자 문서](https://developer.android.com/studio/build)에서 Android 프로젝트용 빌드 스크립트 작성에 대해 자세히 알아보세요.
>
{style="note"}

## 소스 세트

`sourceSets {}` 블록은 프로젝트의 소스 세트를 설명합니다. 소스 세트는 컴파일에 함께 참여하는 Kotlin 소스 파일과 해당 리소스 및 종속성을 포함합니다.

멀티플랫폼 프로젝트는 타겟에 대한 [미리 정의된](#predefined-source-sets) 소스 세트를 포함합니다. 개발자는 필요에 따라 [사용자 지정](#custom-source-sets) 소스 세트를 생성할 수도 있습니다.

### 미리 정의된 소스 세트

미리 정의된 소스 세트는 멀티플랫폼 프로젝트 생성 시 자동으로 설정됩니다. 사용 가능한 미리 정의된 소스 세트는 다음과 같습니다.

| **이름**                                    | **설명**                                                                                                                                                                                               |
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 모든 플랫폼 간에 공유되는 코드 및 리소스. 모든 멀티플랫폼 프로젝트에서 사용 가능합니다. 프로젝트의 모든 메인 [컴파일](#compilations)에 사용됩니다.                                                        |
| `commonTest`                                | 모든 플랫폼 간에 공유되는 테스트 코드 및 리소스. 모든 멀티플랫폼 프로젝트에서 사용 가능합니다. 프로젝트의 모든 테스트 컴파일에 사용됩니다.                                                                    |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 컴파일을 위한 타겟별 소스. _&lt;targetName&gt;_은 미리 정의된 타겟의 이름이고 _&lt;compilationName&gt;_은 이 타겟에 대한 컴파일의 이름입니다. 예시: `jsTest`, `jvmMain`. |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</tab>
</tabs>

[소스 세트](multiplatform-discover-project.md#source-sets)에 대해 자세히 알아보세요.

### 사용자 지정 소스 세트

사용자 지정 소스 세트는 프로젝트 개발자가 수동으로 생성합니다. 사용자 지정 소스 세트를 생성하려면 `sourceSets` 섹션 내부에 해당 이름을 가진 섹션을 추가하세요. Kotlin Gradle DSL을 사용하는 경우, 사용자 지정 소스 세트를 `by creating`으로 표시하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        val myMain by creating { /* ... */ } // 'MyMain'이라는 이름으로 새 소스 세트를 생성합니다.
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        myMain { /* ... */ } // 'myMain'이라는 이름으로 소스 세트를 생성하거나 구성합니다.
    }
}
```

</tab>
</tabs>

새로 생성된 소스 세트는 다른 소스 세트와 연결되지 않습니다. 프로젝트의 컴파일에서 사용하려면 [다른 소스 세트와 연결](multiplatform-hierarchy.md#manual-configuration)하세요.

### 소스 세트 매개변수

소스 세트의 구성은 `sourceSets {}`의 해당 블록 내부에 저장됩니다. 소스 세트는 다음 매개변수들을 가집니다.

| **이름**           | **설명**                                                                        |
|--------------------|----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | 소스 세트 디렉토리 내부의 Kotlin 소스 파일 위치.                       |
| `resources.srcDir` | 소스 세트 디렉토리 내부의 리소스 위치.                                 |
| `dependsOn`        | [다른 소스 세트와의 연결](multiplatform-hierarchy.md#manual-configuration). |
| `dependencies`     | 소스 세트의 [종속성](#dependencies).                                       |
| `languageSettings` | 공유 소스 세트에 적용되는 [언어 설정](#language-settings).              |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain {
            kotlin.srcDir("src")
            resources.srcDir("res")

            dependencies {
                /* ... */
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            kotlin.srcDir('src')
            resources.srcDir('res')

            dependencies {
                /* ... */
            }
        }
    }
}
```

</tab>
</tabs>

## 컴파일

타겟은 예를 들어 프로덕션 또는 테스트를 위한 하나 이상의 컴파일을 가질 수 있습니다. 타겟 생성 시 자동으로 추가되는 [미리 정의된 컴파일](#predefined-compilations)이 있습니다. 추가적으로 [사용자 지정 컴파일](#custom-compilations)을 생성할 수 있습니다.

타겟의 모든 또는 특정 컴파일을 참조하려면 `compilations` 객체 컬렉션을 사용하세요. `compilations`에서 이름으로 컴파일을 참조할 수 있습니다.

[컴파일 구성](multiplatform-configure-compilations.md)에 대해 자세히 알아보세요.

### 미리 정의된 컴파일

미리 정의된 컴파일은 Android 타겟을 제외한 프로젝트의 각 타겟에 대해 자동으로 생성됩니다. 사용 가능한 미리 정의된 컴파일은 다음과 같습니다.

| **이름** | **설명**                     |
|----------|-------------------------------------|
| `main`   | 프로덕션 소스용 컴파일. |
| `test`   | 테스트용 컴파일.              |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // 메인 컴파일 출력 가져오기
        }

        compilations["test"].runtimeDependencyFiles // 테스트 런타임 클래스패스 가져오기
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // 메인 컴파일 출력 가져오기
        compilations.test.runtimeDependencyFiles // 테스트 런타임 클래스패스 가져오기
    }
}
```

</tab>
</tabs>

### 사용자 지정 컴파일

미리 정의된 컴파일 외에도 자신만의 사용자 지정 컴파일을 생성할 수 있습니다. 이를 위해 새 컴파일과 `main` 컴파일 사이에 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 관계를 설정하세요. Kotlin Gradle DSL을 사용하는 경우, 사용자 지정 컴파일을 `by creating`으로 표시하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // main과 해당 클래스패스를 종속성으로 가져오고 내부 가시성을 설정합니다.
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // 이 컴파일에 의해 생성된 테스트를 실행하기 위한 테스트 태스크를 생성합니다.
                testRuns.create("integration") {
                    // 테스트 태스크를 구성합니다.
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // main과 해당 클래스패스를 종속성으로 가져오고 내부 가시성을 설정합니다.
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // 이 컴파일에 의해 생성된 테스트를 실행하기 위한 테스트 태스크를 생성합니다.
            testRuns.create('integration') {
                // 테스트 태스크를 구성합니다.
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</tab>
</tabs>

컴파일을 연관시킴으로써 메인 컴파일 출력을 종속성으로 추가하고 컴파일 간의 `internal` 가시성을 설정합니다.

[사용자 지정 컴파일](multiplatform-configure-compilations.md#create-a-custom-compilation) 생성에 대해 자세히 알아보세요.

### 컴파일 매개변수

컴파일은 다음 매개변수들을 가집니다.

| **이름**                 | **설명**                                                                                                                                                           |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 컴파일의 기본 소스 세트.                                                                                                                                     |
| `kotlinSourceSets`       | 컴파일에 참여하는 소스 세트.                                                                                                                             |
| `allKotlinSourceSets`    | 컴파일에 참여하는 소스 세트 및 `dependsOn()`을 통한 연결.                                                                                                                                   |
| `compilerOptions`        | 컴파일에 적용되는 컴파일러 옵션. 사용 가능한 옵션 목록은 [컴파일러 옵션](https://kotlinlang.org/docs/gradle-compiler-options.html)을 참조하세요.         |
| `compileKotlinTask`      | Kotlin 소스를 컴파일하기 위한 Gradle 태스크.                                                                                                                                 |
| `compileKotlinTaskName`  | `compileKotlinTask`의 이름.                                                                                                                                              |
| `compileAllTaskName`     | 컴파일의 모든 소스를 컴파일하기 위한 Gradle 태스크의 이름.                                                                                                       |
| `output`                 | 컴파일 출력.                                                                                                                                                   |
| `compileDependencyFiles` | 컴파일의 컴파일 시 종속성 파일(클래스패스). 모든 Kotlin/Native 컴파일의 경우, 여기에는 표준 라이브러리 및 플랫폼 종속성이 자동으로 포함됩니다. |
| `runtimeDependencyFiles` | 컴파일의 런타임 종속성 파일(클래스패스).                                                                                                                  |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 'main' 컴파일에 대한 Kotlin 컴파일러 옵션을 설정합니다:
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }

            compileKotlinTask // Kotlin 태스크 'compileKotlinJvm' 가져오기
            output // 메인 컴파일 출력 가져오기
        }

        compilations["test"].runtimeDependencyFiles // 테스트 런타임 클래스패스 가져오기
    }

    // 모든 타겟의 모든 컴파일을 구성합니다:
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                // 'main' 컴파일에 대한 Kotlin 컴파일러 옵션을 설정합니다:
                jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // Kotlin 태스크 'compileKotlinJvm' 가져오기
        compilations.main.output // 메인 컴파일 출력 가져오기
        compilations.test.runtimeDependencyFiles // 테스트 런타임 클래스패스 가져오기
    }

    // 모든 타겟의 모든 컴파일을 구성합니다:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

## 컴파일러 옵션

프로젝트에서 컴파일러 옵션을 세 가지 다른 수준으로 구성할 수 있습니다.

*   **확장 수준**(Extension level): `kotlin {}` 블록 내부.
*   **타겟 수준**(Target level): 타겟 블록 내부.
*   **컴파일 유닛 수준**(Compilation unit level): 일반적으로 특정 컴파일 태스크 내부.

![Kotlin 컴파일러 옵션 수준](compiler-options-levels.svg){width=700}

상위 수준의 설정은 하위 수준의 기본값으로 작동합니다.

*   확장 수준에서 설정된 컴파일러 옵션은 `commonMain`, `nativeMain`, `commonTest`와 같은 공유 소스 세트를 포함하여 타겟 수준 옵션의 기본값입니다.
*   타겟 수준에서 설정된 컴파일러 옵션은 `compileKotlinJvm` 및 `compileTestKotlinJvm` 태스크와 같은 컴파일 유닛(태스크) 수준 옵션의 기본값입니다.

하위 수준에서 이루어진 구성은 상위 수준의 유사한 설정을 재정의합니다.

*   태스크 수준 컴파일러 옵션은 타겟 또는 확장 수준의 유사한 설정을 재정의합니다.
*   타겟 수준 컴파일러 옵션은 확장 수준의 유사한 설정을 재정의합니다.

가능한 컴파일러 옵션 목록은 [모든 컴파일러 옵션](https://kotlinlang.org/docs/gradle-compiler-options.html#all-compiler-options)을 참조하세요.

### 확장 수준

프로젝트의 모든 타겟에 대한 컴파일러 옵션을 구성하려면 최상위에서 `compilerOptions {}` 블록을 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // 모든 타겟의 모든 컴파일을 구성합니다.
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    // 모든 타겟의 모든 컴파일을 구성합니다:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

### 타겟 수준

프로젝트의 특정 타겟에 대한 컴파일러 옵션을 구성하려면 타겟 블록 내부에 `compilerOptions {}` 블록을 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // JVM 타겟의 모든 컴파일을 구성합니다.
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // JVM 타겟의 모든 컴파일을 구성합니다.
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</tab>
</tabs>

### 컴파일 유닛 수준

특정 태스크에 대한 컴파일러 옵션을 구성하려면 태스크 내부에 `compilerOptions {}` 블록을 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</tab>
</tabs>

특정 컴파일에 대한 컴파일러 옵션을 구성하려면 컴파일의 태스크 프로바이더 내부에 `compilerOptions {}` 블록을 사용하세요.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' 컴파일을 구성합니다:
                compilerOptions {
                    allWarningsAsErrors.set(true)
                }
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' 컴파일을 구성합니다:
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</tab>
</tabs>

### `kotlinOptions {}`에서 `compilerOptions {}`로 마이그레이션 {collapsible="true"}

Kotlin 2.2.0 이전에는 `kotlinOptions {}` 블록을 사용하여 컴파일러 옵션을 구성할 수 있었습니다. `kotlinOptions {}` 블록이 Kotlin 2.2.0에서 더 이상 사용되지 않으므로, 대신 빌드 스크립트에서 `compilerOptions {}` 블록을 사용해야 합니다. 자세한 내용은 [kotlinOptions{}에서 compilerOptions{}로 마이그레이션](https://kotlinlang.org/docs/gradle-compiler-options.html#migrate-from-kotlinoptions-to-compileroptions)을 참조하세요.

## 종속성

소스 세트 선언의 `dependencies {}` 블록에는 이 소스 세트의 종속성이 포함됩니다.

[종속성 구성](https://kotlinlang.org/docs/gradle-configure-project.html)에 대해 자세히 알아보세요.

네 가지 유형의 종속성이 있습니다.

| **이름**         | **설명**                                                                     |
|------------------|-------------------------------------------------------------------------------------|
| `api`            | 현재 모듈의 API에서 사용되는 종속성.                                 |
| `implementation` | 모듈 내에서 사용되지만 외부로 노출되지 않는 종속성.                         |
| `compileOnly`    | 현재 모듈의 컴파일에만 사용되는 종속성.                       |
| `runtimeOnly`    | 런타임에 사용 가능하지만 어떤 모듈의 컴파일 중에도 보이지 않는 종속성. |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                api("com.example:foo-metadata:1.0")
            }
        }
        jvmMain {
            dependencies {
                implementation("com.example:foo-jvm:1.0")
            }
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                api 'com.example:foo-metadata:1.0'
            }
        }
        jvmMain {
            dependencies {
                implementation 'com.example:foo-jvm:1.0'
            }
        }
    }
}
```

</tab>
</tabs>

추가적으로, 소스 세트는 서로 종속되어 계층을 형성할 수 있습니다. 이 경우 [`dependsOn()`](#source-set-parameters) 관계가 사용됩니다.

소스 세트 종속성은 빌드 스크립트의 최상위 `dependencies {}` 블록에서도 선언될 수 있습니다. 이 경우 해당 선언은 `<sourceSetName><DependencyKind>` 패턴을 따르며, 예시로는 `commonMainApi`가 있습니다.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    "commonMainApi"("com.example:foo-common:1.0")
    "jvm6MainApi"("com.example:foo-jvm6:1.0")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    commonMainApi 'com.example:foo-common:1.0'
    jvm6MainApi 'com.example:foo-jvm6:1.0'
}
```

</tab>
</tabs>

## 언어 설정

소스 세트의 `languageSettings {}` 블록은 프로젝트 분석 및 컴파일의 특정 측면을 정의합니다. `languageSettings {}` 블록은 공유 소스 세트에만 특별히 적용되는 설정을 구성하는 데만 사용하세요. 다른 모든 경우에는 확장 또는 타겟 수준에서 [컴파일러 옵션](#compiler-options)을 구성하려면 `compilerOptions {}` 블록을 사용하세요.

다음 언어 설정들을 사용할 수 있습니다.

| **이름**                | **설명**                                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `languageVersion`       | 지정된 Kotlin 버전과의 소스 호환성을 제공합니다.                                                                                                             |
| `apiVersion`            | 지정된 Kotlin 번들 라이브러리 버전의 선언만 사용할 수 있도록 허용합니다.                                                                                          |
| `enableLanguageFeature` | 지정된 언어 기능을 활성화합니다. 사용 가능한 값은 현재 실험적이거나 특정 시점에 실험적으로 도입된 언어 기능에 해당합니다. |
| `optIn`                 | 지정된 [옵트인(opt-in) 어노테이션](https://kotlinlang.org/docs/opt-in-requirements.html)을 사용할 수 있도록 허용합니다.                                                                           |
| `progressiveMode`       | [프로그레시브 모드](https://kotlinlang.org/docs/whatsnew13.html#progressive-mode)를 활성화합니다.                                                                                   |

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // 가능한 값: "1.8", "1.9", "2.0", "2.1"
            apiVersion = "%apiVersion%" // 가능한 값: "1.8", "1.9", "2.0", "2.1"
            enableLanguageFeature("InlineClasses") // 언어 기능 이름
            optIn("kotlin.ExperimentalUnsignedTypes") // 어노테이션 FQ-name
            progressiveMode = true // 기본값은 false
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // 가능한 값: '1.8', '1.9', '2.0', '2.1'
            apiVersion = '%apiVersion%' // 가능한 값: '1.8', '1.9', '2.0', '2.1'
            enableLanguageFeature('InlineClasses') // 언어 기능 이름
            optIn('kotlin.ExperimentalUnsignedTypes') // 어노테이션 FQ-name
            progressiveMode = true // 기본값은 false
        }
    }
}
```

</tab>
</tabs>