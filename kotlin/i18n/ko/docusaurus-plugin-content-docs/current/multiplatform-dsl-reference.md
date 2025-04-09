---
title: "멀티플랫폼 Gradle DSL 레퍼런스"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform Gradle 플러그인은 Kotlin Multiplatform 프로젝트를 만들기 위한 도구입니다.
여기서는 해당 내용에 대한 레퍼런스를 제공합니다. Kotlin Multiplatform 프로젝트용 Gradle 빌드 스크립트를 작성할 때 참고 자료로 활용하세요. [Kotlin Multiplatform 프로젝트의 개념, 생성 및 구성 방법](multiplatform-intro)에 대해 알아보세요.

## ID 및 버전

Kotlin Multiplatform Gradle 플러그인의 정규화된 이름은 `org.jetbrains.kotlin.multiplatform`입니다.
Kotlin Gradle DSL을 사용하는 경우 `kotlin("multiplatform")`으로 플러그인을 적용할 수 있습니다.
플러그인 버전은 Kotlin 릴리스 버전과 일치합니다. 최신 버전은 2.1.20입니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("multiplatform") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}
```

</TabItem>
</Tabs>

## 최상위 블록

`kotlin {}`은 Gradle 빌드 스크립트에서 멀티플랫폼 프로젝트 구성을 위한 최상위 블록입니다.
`kotlin {}` 안에서 다음 블록을 작성할 수 있습니다.

| **블록**            | **설명**                                                                                                                                 |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 프로젝트의 특정 타겟을 선언합니다. 사용 가능한 타겟 이름은 [타겟](#targets) 섹션에 나열되어 있습니다.                                         |
| `targets`            | 프로젝트의 모든 타겟을 나열합니다.                                                                                                        |
| `sourceSets`         | 프로젝트의 미리 정의된 [소스 세트](#source-sets)를 구성하고 사용자 정의 소스 세트를 선언합니다.                                                       |
| `compilerOptions`    | 모든 타겟 및 공유 소스 세트에 대한 기본값으로 사용되는 일반적인 확장 수준 [컴파일러 옵션](#compiler-options)을 지정합니다. |

## 타겟

_타겟_은 지원되는 플랫폼 중 하나를 대상으로 하는 소프트웨어 조각을 컴파일, 테스트 및 패키징하는 빌드 부분입니다. Kotlin은 각 플랫폼에 대한 타겟을 제공하므로 Kotlin에 특정 타겟용 코드를 컴파일하도록 지시할 수 있습니다. [타겟 설정](multiplatform-discover-project#targets)에 대해 자세히 알아보세요.

각 타겟은 하나 이상의 [컴파일](#compilations)을 가질 수 있습니다. 테스트 및 프로덕션 목적을 위한 기본 컴파일 외에도 [사용자 정의 컴파일을 생성](multiplatform-configure-compilations#create-a-custom-compilation)할 수 있습니다.

멀티플랫폼 프로젝트의 타겟은 `kotlin {}` 내부의 해당 블록에 설명되어 있습니다(예: `jvm`, `androidTarget`, `iosArm64`).
사용 가능한 전체 타겟 목록은 다음과 같습니다.
<table>
<tr>
        <th>타겟 플랫폼</th>
        <th>타겟</th>
        <th>설명</th>
</tr>
<tr>
<td>
Kotlin/JVM
</td>
<td>
`jvm`
</td>
<td>
</td>
</tr>
<tr>
<td rowspan="2">
Kotlin/Wasm
</td>
<td>
`wasmJs`
</td>
<td>
JavaScript 런타임에서 프로젝트를 실행하려는 경우 사용합니다.
</td>
</tr>
<tr>
<td>
`wasmWasi`
</td>
<td>
<a href="https://github.com/WebAssembly/WASI">WASI</a> 시스템 인터페이스에 대한 지원이 필요한 경우 사용합니다.
</td>
</tr>
<tr>
<td>
Kotlin/JS
</td>
<td>
`js`
</td>
<td>

<p>
   실행 환경을 선택합니다.
</p>
<list>
<li>브라우저에서 실행되는 애플리케이션의 경우 `browser {}`</li>
<li>Node.js에서 실행되는 애플리케이션의 경우 `nodejs {}`</li>
</list>
<p>
   자세한 내용은 <a href="js-project-setup#execution-environments">Kotlin/JS 프로젝트 설정</a>에서 확인하세요.
</p>
</td>
</tr>
<tr>
<td>
Kotlin/Native
</td>
<td>
</td>
<td>

<p>
   macOS, Linux 및 Windows 호스트에 대해 현재 지원되는 타겟에 대한 자세한 내용은 <a href="native-target-support">Kotlin/Native 타겟 지원</a>에서 확인하세요.
</p>
</td>
</tr>
<tr>
<td>
Android 애플리케이션 및 라이브러리
</td>
<td>
`androidTarget`
</td>
<td>

<p>
   Android Gradle 플러그인을 수동으로 적용합니다. `com.android.application` 또는 `com.android.library`.
</p>
<p>
   Gradle 하위 프로젝트당 하나의 Android 타겟만 만들 수 있습니다.
</p>
</td>
</tr>
</table>
:::note
현재 호스트에서 지원되지 않는 타겟은 빌드 중에 무시되므로 게시되지 않습니다.

:::

```groovy
kotlin {
    jvm()
    iosArm64()
    macosX64()
    js().browser()
}
```

타겟 구성에는 두 가지 부분이 포함될 수 있습니다.

* 모든 타겟에 사용할 수 있는 [공통 구성](#common-target-configuration).
* 타겟별 구성.

각 타겟은 하나 이상의 [컴파일](#compilations)을 가질 수 있습니다.

### 공통 타겟 구성

모든 타겟 블록에서 다음 선언을 사용할 수 있습니다.

| **이름**            | **설명**                                                                                                                                                                          | 
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 이 타겟에 대한 Kotlin 플랫폼입니다. 사용 가능한 값: `jvm`, `androidJvm`, `js`, `wasm`, `native`, `common`.                                                                         |
| `artifactsTaskName` | 이 타겟의 결과 아티팩트를 빌드하는 작업의 이름입니다.                                                                                                                             |
| `components`        | Gradle 게시를 설정하는 데 사용되는 컴포넌트입니다.                                                                                                                                |
| `compilerOptions`   | 타겟에 사용되는 [컴파일러 옵션](#compiler-options)입니다. 이 선언은 [최상위 수준](multiplatform-dsl-reference#top-level-blocks)에서 구성된 `compilerOptions {}`를 재정의합니다. |

### 웹 타겟

`js {}` 블록은 JavaScript와 상호 운용 가능한 Kotlin/JS 타겟의 구성을 설명하고, `wasmJs {}` 블록은 Kotlin/Wasm 타겟의 구성을 설명합니다. 여기에는 타겟 실행에 따라 두 개의 블록 중 하나가 포함될 수 있습니다.
환경:

| **이름**              | **설명**                           | 
|-----------------------|--------------------------------------|
| [`browser`](#browser) | 브라우저 타겟의 구성입니다.         |
| [`nodejs`](#node-js)  | Node.js 타겟의 구성입니다.        |

[Kotlin/JS 프로젝트 구성](js-project-setup)에 대해 자세히 알아보세요.

별도의 `wasmWasi {}` 블록은 WASI 시스템 인터페이스를 지원하는 Kotlin/Wasm 타겟의 구성을 설명합니다.
여기서는 [`nodejs`](#node-js) 실행 환경만 사용할 수 있습니다.

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

모든 웹 타겟(`js`, `wasmJs` 및 `wasmWasi`)은 `binaries.executable()` 호출도 지원합니다. 명시적으로
Kotlin 컴파일러에 실행 파일을 내보내도록 지시합니다. 자세한 내용은 [실행 환경](js-project-setup#execution-environments)을 참조하세요.
Kotlin/JS 문서에서 확인하세요.

#### 브라우저

`browser {}`는 다음 구성 블록을 포함할 수 있습니다.

| **이름**       | **설명**                                                       | 
|----------------|---------------------------------------------------------------|
| `testRuns`     | 테스트 실행 구성입니다.                                        |
| `runTask`      | 프로젝트 실행 구성입니다.                                      |
| `webpackTask`  | [Webpack](https://webpack.js.org/)을 사용한 프로젝트 번들링 구성입니다. |
| `distribution` | 출력 파일 경로입니다.                                           |

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

`nodejs {}`는 테스트 및 실행 작업의 구성을 포함할 수 있습니다.

| **이름**   | **설명**                       | 
|------------|-------------------------------|
| `testRuns` | 테스트 실행 구성입니다.      |
| `runTask`  | 프로젝트 실행 구성입니다.   |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### 네이티브 타겟

네이티브 타겟의 경우 다음 특정 블록을 사용할 수 있습니다.

| **이름**    | **설명**                               | 
|-------------|---------------------------------------|
| `binaries`  | 생성할 [바이너리](#binaries) 구성입니다. |
| `cinterops` | [C 라이브러리와의 상호 운용](#cinterops) 구성입니다. |

#### 바이너리

다음과 같은 종류의 바이너리가 있습니다.

| **이름**     | **설명**        | 
|--------------|----------------|
| `executable` | 제품 실행 파일입니다. |
| `test`       | 테스트 실행 파일입니다. |
| `sharedLib`  | 공유 라이브러리입니다. |
| `staticLib`  | 정적 라이브러리입니다. |
| `framework`  | Objective-C 프레임워크입니다. |

```kotlin
kotlin {
    linuxX64 { // 타겟 대신 사용하세요.
        binaries {
            executable {
                // 바이너리 구성.
            }
        }
    }
}
```

바이너리 구성에는 다음 매개변수를 사용할 수 있습니다.

| **이름**      | **설명**                                                                                                                                                  | 
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 바이너리가 빌드되는 컴파일입니다. 기본적으로 `test` 바이너리는 `test` 컴파일을 기반으로 하고 다른 바이너리는 `main` 컴파일을 기반으로 합니다. |
| `linkerOpts`  | 바이너리 빌드 중에 시스템 링커에 전달되는 옵션입니다.                                                                                                       |
| `baseName`    | 출력 파일의 사용자 지정 기본 이름입니다. 최종 파일 이름은 시스템에 종속적인 접두사 및 접미사를 이 기본 이름에 추가하여 형성됩니다.                       |
| `entryPoint`  | 실행 파일 바이너리의 진입점 함수입니다. 기본적으로 루트 패키지의 `main()`입니다.                                                                 |
| `outputFile`  | 출력 파일에 대한 액세스입니다.                                                                                                                               |
| `linkTask`    | 링크 작업에 대한 액세스입니다.                                                                                                                                 |
| `runTask`     | 실행 파일 바이너리에 대한 실행 작업에 대한 액세스입니다. `linuxX64`, `macosX64` 또는 `mingwX64` 이외의 타겟의 경우 값은 `null`입니다.                |
| `isStatic`    | Objective-C 프레임워크의 경우 정적 라이브러리를 동적 라이브러리 대신 포함합니다.                                                                                  |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 테스트 컴파일을 기반으로 바이너리를 빌드합니다.
        compilation = compilations["test"]

        // 링커에 대한 사용자 지정 명령줄 옵션입니다.
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 출력 파일의 기본 이름입니다.
        baseName = "foo"

        // 사용자 지정 진입점 함수입니다.
        entryPoint = "org.example.main"

        // 출력 파일에 액세스합니다.
        println("실행 파일 경로: ${outputFile.absolutePath}")

        // 링크 작업에 액세스합니다.
        linkTask.dependsOn(additionalPreprocessingTask)

        // 실행 작업에 액세스합니다.
        // runTask는 비 호스트 플랫폼의 경우 null입니다.
        runTask?.dependsOn(prepareForRun)
    }

    framework("my_framework" listOf(RELEASE)) {
        // 프레임워크에 동적 라이브러리 대신 정적 라이브러리를 포함합니다.
        isStatic = true
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 테스트 컴파일을 기반으로 바이너리를 빌드합니다.
        compilation = compilations.test

        // 링커에 대한 사용자 지정 명령줄 옵션입니다.
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 출력 파일의 기본 이름입니다.
        baseName = 'foo'

        // 사용자 지정 진입점 함수입니다.
        entryPoint = 'org.example.main'

        // 출력 파일에 액세스합니다.
        println("실행 파일 경로: ${outputFile.absolutePath}")

        // 링크 작업에 액세스합니다.
        linkTask.dependsOn(additionalPreprocessingTask)

        // 실행 작업에 액세스합니다.
        // runTask는 비 호스트 플랫폼의 경우 null입니다.
        runTask?.dependsOn(prepareForRun)
    }

    framework('my_framework' [RELEASE]) {
        // 프레임워크에 동적 라이브러리 대신 정적 라이브러리를 포함합니다.
        isStatic = true
    }
}
```

</TabItem>
</Tabs>

[네이티브 바이너리 빌드](multiplatform-build-native-binaries)에 대해 자세히 알아보세요.

#### CInterops

`cinterops`는 네이티브 라이브러리와의 상호 운용에 대한 설명 모음입니다.
라이브러리와의 상호 운용을 제공하려면 `cinterops`에 항목을 추가하고 해당 매개변수를 정의합니다.

| **이름**         | **설명**                                   | 
|------------------|-------------------------------------------|
| `definitionFile` | 네이티브 API를 설명하는 `.def` 파일입니다. |
| `packageName`    | 생성된 Kotlin API의 패키지 접두사입니다.  |
| `compilerOpts`   | cinterop 도구에서 컴파일러에 전달할 옵션입니다. |
| `includeDirs`    | 헤더를 찾을 디렉터리입니다.                |
| `header`         | 바인딩에 포함할 헤더입니다.                |
| `headers`        | 바인딩에 포함할 헤더 목록입니다.           |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    linuxX64 { // 필요한 타겟으로 바꿉니다.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 네이티브 API를 설명하는 Def 파일입니다.
                // 기본 경로는 src/nativeInterop/cinterop/<interop-name>.def입니다.
                definitionFile.set(project.file("def-file.def"))

                // 생성된 Kotlin API를 배치할 패키지입니다.
                packageName("org.sample")

                // cinterop 도구에서 컴파일러에 전달할 옵션입니다.
                compilerOpts("-Ipath/to/headers")

                // 헤더 검색을 위한 디렉터리(컴파일러 옵션 -I<path>와 유사).
                includeDirs.allHeaders("path1", "path2")

                // includeDirs.allHeaders의 바로 가기입니다.
                includeDirs("include/directory", "another/directory")

                // 바인딩에 포함할 헤더 파일입니다.
                header("path/to/header.h")
                headers("path/to/header1.h", "path/to/header2.h")
            }

            val anotherInterop by cinterops.creating { /* ... */ }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    linuxX64 { // 필요한 타겟으로 바꿉니다.
        compilations.main {
            cinterops {
                myInterop {
                    // 네이티브 API를 설명하는 Def 파일입니다.
                    // 기본 경로는 src/nativeInterop/cinterop/<interop-name>.def입니다.
                    definitionFile = project.file("def-file.def")

                    // 생성된 Kotlin API를 배치할 패키지입니다.
                    packageName 'org.sample'

                    // cinterop 도구에서 컴파일러에 전달할 옵션입니다.
                    compilerOpts '-Ipath/to/headers'

                    // 헤더 검색을 위한 디렉터리(컴파일러 옵션 -I<path>와 유사).
                    includeDirs.allHeaders("path1", "path2")

                    // includeDirs.allHeaders의 바로 가기입니다.
                    includeDirs("include/directory", "another/directory")

                    // 바인딩에 포함할 헤더 파일입니다.
                    header("path/to/header.h")
                    headers("path/to/header1.h", "path/to/header2.h")
                }

                anotherInterop { /* ... */ }
            }
        }
    }
}
```

</TabItem>
</Tabs>

더 많은 cinterop 속성은 [정의 파일](native-definition-file#properties)을 참조하세요.

### Android 타겟

Kotlin Multiplatform 플러그인에는 Android 타겟을 위한 두 가지 특정 함수가 포함되어 있습니다.
두 함수는 [빌드 변형](https://developer.android.com/studio/build/build-variants)을 구성하는 데 도움이 됩니다.

| **이름**                      | **설명**                                                                                                                                | 
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 게시할 빌드 변형을 지정합니다. [Android 라이브러리 게시](multiplatform-publish-lib#publish-an-android-library)에 대해 자세히 알아보세요. |
| `publishAllLibraryVariants()` | 모든 빌드 변형을 게시합니다.                                                                                                         |

```kotlin
kotlin {
    androidTarget {
        publishLibraryVariants("release")
    }
}
```

[Android 컴파일](multiplatform-configure-compilations#compilation-for-android)에 대해 자세히 알아보세요.

:::note
`kotlin {}` 블록 내부의 `androidTarget` 구성은 Android 프로젝트의 빌드 구성을 대체하지 않습니다.
[Android 개발자 문서](https://developer.android.com/studio/build)에서 Android 프로젝트용 빌드 스크립트 작성에 대해 자세히 알아보세요.

:::

## 소스 세트

`sourceSets {}` 블록은 프로젝트의 소스 세트를 설명합니다. 소스 세트에는 함께 컴파일에 참여하는 Kotlin 소스 파일과 해당 리소스, 종속성 및 언어 설정이 포함됩니다.

멀티플랫폼 프로젝트에는 해당 타겟에 대한 [미리 정의된](#predefined-source-sets) 소스 세트가 포함되어 있습니다.
개발자는 필요에 따라 [사용자 정의](#custom-source-sets) 소스 세트를 만들 수도 있습니다.

### 미리 정의된 소스 세트

미리 정의된 소스 세트는 멀티플랫폼 프로젝트 생성 시 자동으로 설정됩니다.
사용 가능한 미리 정의된 소스 세트는 다음과 같습니다.

| **이름**                                    | **설명**                                                                                                                                                                                                   | 
|---------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 모든 플랫폼 간에 공유되는 코드 및 리소스입니다. 모든 멀티플랫폼 프로젝트에서 사용할 수 있습니다. 프로젝트의 모든 기본 [컴파일](#compilations)에서 사용됩니다.                                                      |
| `commonTest`                                | 모든 플랫폼 간에 공유되는 테스트 코드 및 리소스입니다. 모든 멀티플랫폼 프로젝트에서 사용할 수 있습니다. 프로젝트의 모든 테스트 컴파일에서 사용됩니다.                                                                  |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 컴파일에 대한 타겟별 소스입니다. _&lt;targetName&gt;_은 미리 정의된 타겟의 이름이고 _&lt;compilationName&gt;_은 이 타겟에 대한 컴파일의 이름입니다. 예: `jsTest`, `jvmMain`. |

Kotlin Gradle DSL을 사용하면 미리 정의된 소스 세트의 섹션에 `by getting`을 표시해야 합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting { /* ... */ }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        commonMain { /* ... */ } 
    }
}
```

</TabItem>
</Tabs>

[소스 세트](multiplatform-discover-project#source-sets)에 대해 자세히 알아보세요.

### 사용자 정의 소스 세트

사용자 정의 소스 세트는 프로젝트 개발자가 수동으로 만듭니다.
사용자 정의 소스 세트를 만들려면 `sourceSets` 섹션 내부에 해당 이름으로 섹션을 추가합니다.
Kotlin Gradle DSL을 사용하는 경우 사용자 지정 소스 세트에 `by creating`을 표시합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin { 
    sourceSets { 
        val myMain by creating { /* ... */ } // 'MyMain' 이름으로 새 소스 세트를 만듭니다.
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
    sourceSets { 
        myMain { /* ... */ } // 'myMain' 이름으로 소스 세트를 만들거나 구성합니다.
    }
}
```

</TabItem>
</Tabs>

새로 만든 소스 세트는 다른 소스 세트에 연결되지 않습니다. 프로젝트의 컴파일에서 사용하려면
[다른 소스 세트와 연결](multiplatform-hierarchy#manual-configuration)하세요.

### 소스 세트 매개변수

소스 세트의 구성은 `sourceSets {}`의 해당 블록 내부에 저장됩니다. 소스 세트에는 다음 매개변수가 있습니다.

| **이름**           | **설명**                                                                        | 
|--------------------|----------------------------------------------------------------------------------------|
| `kotlin.srcDir`    | 소스 세트 디렉터리 내부의 Kotlin 소스 파일 위치입니다.                                 |
| `resources.srcDir` | 소스 세트 디렉터리 내부의 리소스 위치입니다.                                        |
| `dependsOn`        | [다른 소스 세트와의 연결](multiplatform-hierarchy#manual-configuration)입니다. |
| `dependencies`     | 소스 세트의 [종속성](#dependencies)입니다.                                       |
| `languageSettings` | 소스 세트에 적용되는 [언어 설정](#language-settings)입니다.                     |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin { 
    sourceSets { 
        val commonMain by getting {
            kotlin.srcDir("src")
            resources.srcDir("res")

            dependencies {
                /* ... */
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin { 
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

</TabItem>
</Tabs>

## 컴파일

타겟은 프로덕션 또는 테스트와 같은 하나 이상의 컴파일을 가질 수 있습니다. [미리 정의된 컴파일](#predefined-compilations)이 있습니다.
타겟 생성 시 자동으로 추가됩니다. 추가로 [사용자 정의 컴파일](#custom-compilations)을 만들 수 있습니다.

타겟의 모든 컴파일 또는 특정 컴파일을 참조하려면 `compilations` 객체 컬렉션을 사용하세요.
`compilations`에서 이름으로 컴파일을 참조할 수 있습니다.

[컴파일 구성](multiplatform-configure-compilations)에 대해 자세히 알아보세요.

### 미리 정의된 컴파일

미리 정의된 컴파일은 Android 타겟을 제외하고 프로젝트의 각 타겟에 대해 자동으로 생성됩니다.
사용 가능한 미리 정의된 컴파일은 다음과 같습니다.

| **이름** | **설명**                   | 
|----------|---------------------------|
| `main`   | 프로덕션 소스 컴파일입니다. |
| `test`   | 테스트 컴파일입니다.        |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            output // 기본 컴파일 출력을 가져옵니다.
        }

        compilations["test"].runtimeDependencyFiles // 테스트 런타임 클래스 경로를 가져옵니다.
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        compilations.main.output // 기본 컴파일 출력을 가져옵니다.
        compilations.test.runtimeDependencyFiles // 테스트 런타임 클래스 경로를 가져옵니다.
    }
}
```

</TabItem>
</Tabs>

### 사용자 정의 컴파일

미리 정의된 컴파일 외에도 사용자 지정 컴파일을 만들 수 있습니다.
사용자 지정 컴파일을 만들려면 `compilations` 컬렉션에 새 항목을 추가합니다.
Kotlin Gradle DSL을 사용하는 경우 사용자 지정 컴파일에 `by creating`을 표시합니다.

[사용자 지정 컴파일](multiplatform-configure-compilations#create-a-custom-compilation) 만들기에 대해 자세히 알아보세요.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm() {
        compilations {
            val integrationTest by compilations.creating {
                defaultSourceSet {
                    dependencies {
                        /* ... */
                    }
                }

                // 이 컴파일에서 생성된 테스트를 실행할 테스트 작업을 만듭니다.
                tasks.register<Test>("integrationTest") {
                    /* ... */
                }
            }
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm() {
        compilations.create('integrationTest') {
            defaultSourceSet {
                dependencies {
                    /* ... */
                }
            }

            // 이 컴파일에서 생성된 테스트를 실행할 테스트 작업을 만듭니다.
            tasks.register('jvmIntegrationTest', Test) {
                /* ... */
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 컴파일 매개변수

컴파일에는 다음 매개변수가 있습니다.

| **이름**                 | **설명**                                                                                                                                                       | 
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 컴파일의 기본 소스 세트입니다.                                                                                                                                  |
| `kotlinSourceSets`       | 컴파일에 참여하는 소스 세트입니다.                                                                                                                              |
| `allKotlinSourceSets`    | 컴파일에 참여하는 소스 세트와 `dependsOn()`을 통한 연결입니다.                                                                                                  |
| `compilerOptions`        | 컴파일에 적용되는 컴파일러 옵션입니다. 사용 가능한 옵션 목록은 [컴파일러 옵션](gradle-compiler-options)을 참조하세요.                                        |
| `compileKotlinTask`      | Kotlin 소스를 컴파일하기 위한 Gradle 작업입니다.                                                                                                                     |
| `compileKotlinTaskName`  | `compileKotlinTask`의 이름입니다.                                                                                                                               |
| `compileAllTaskName`     | 컴파일의 모든 소스를 컴파일하기 위한 Gradle 작업의 이름입니다.                                                                                                    |
| `output`                 | 컴파일 출력입니다.                                                                                                                                                |
| `compileDependencyFiles` | 컴파일의 컴파일 시간 종속성 파일(클래스 경로)입니다. 모든 Kotlin/Native 컴파일의 경우, 여기에는 표준 라이브러리 및 플랫폼 종속성이 자동으로 포함됩니다. |
| `runtimeDependencyFiles` | 컴파일의 런타임 종속성 파일(클래스 경로)입니다.                                                                                                                   |

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 'main' 컴파일에 대한 Kotlin 컴파일러 옵션을 설정합니다.
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }
        
            compileKotlinTask // Kotlin 작업 'compileKotlinJvm' 가져오기
            output // 기본 컴파일 출력을 가져옵니다.
        }
        
        compilations["test"].runtimeDependencyFiles // 테스트 런타임 클래스 경로를 가져옵니다.
    }

    // 모든 타겟의 모든 컴파일을 구성합니다.
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    // 'main' 컴파일에 대한 Kotlin 컴파일러 옵션을 설정합니다.
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // Kotlin 작업 'compileKotlinJvm' 가져오기
        compilations.main.output // 기본 컴파일 출력을 가져옵니다.
        compilations.test.runtimeDependencyFiles // 테스트 런타임 클래스 경로를 가져옵니다.
    }

    // 모든 타겟의 모든 컴파일을 구성합니다.
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 컴파일러 옵션

프로젝트에서 컴파일러 옵션을 세 가지 수준으로 구성할 수 있습니다.

* **확장 수준**, `kotlin {}` 블록에서.
* **타겟 수준**, 타겟 블록에서.
* **컴파일 단위 수준**, 일반적으로 특정 컴파일 작업에서.

<img src="/img/compiler-options-levels.svg" alt="Kotlin 컴파일러 옵션 수준" width="700" style={{verticalAlign: 'middle'}}/>

더 높은 수준의 설정은 하위 수준의 기본값으로 작동합니다.

* 확장 수준에서 설정된 컴파일러 옵션은 `commonMain`, `nativeMain` 및 `commonTest`와 같은 공유 소스 세트를 포함하여 타겟 수준 옵션의 기본값입니다.
* 타겟 수준에서 설정된 컴파일러 옵션은 `compileKotlinJvm` 및 `compileTestKotlinJvm` 작업과 같은 컴파일 단위(작업) 수준 옵션의 기본값입니다.

하위 수준에서 이루어진 구성은 더 높은 수준의 유사한 설정을 재정의합니다.

* 작업 수준 컴파일러 옵션은 타겟 또는 확장 수준에서 유사한 설정을 재정의합니다.
* 타겟 수준 컴파일러 옵션은 확장 수준에서 유사한 설정을 재정의합니다.

가능한 컴파일러 옵션 목록은 [모든 컴파일러 옵션](gradle-compiler-options#all-compiler-options)을 참조하세요.

### 확장 수준

프로젝트의 모든 타겟에 대한 컴파일러 옵션을 구성하려면 최상위 수준에서 `compilerOptions {}` 블록을 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    // 모든 타겟의 모든 컴파일을 구성합니다.
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    // 모든 타겟의 모든 컴파일을 구성합니다.
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

### 타겟 수준

프로젝트의 특정 타겟에 대한 컴파일러 옵션을 구성하려면 타겟 블록 내에서 `compilerOptions {}` 블록을 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

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

</TabItem>
<TabItem value="groovy" label="Groovy" default>

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

</TabItem>
</Tabs>

### 컴파일 단위 수준

특정 작업에 대한 컴파일러 옵션을 구성하려면 작업 내에서 `compilerOptions {}` 블록을 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

특정 컴파일에 대한 컴파일러 옵션을 구성하려면 컴파일의 작업 공급자 내에서 `compilerOptions {}` 블록을 사용합니다.

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' 컴파일을 구성합니다
```
</TabItem>
</Tabs>