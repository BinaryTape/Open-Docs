[//]: # (title: 멀티플랫폼 Gradle DSL 참조)

Kotlin 멀티플랫폼 Gradle 플러그인은 Kotlin 멀티플랫폼 프로젝트를 생성하기 위한 도구입니다.
여기서는 플러그인의 내용에 대한 참조를 제공합니다. Kotlin 멀티플랫폼 프로젝트용 Gradle 빌드 스크립트를 작성할 때 참고 자료로 활용하세요. [Kotlin 멀티플랫폼 프로젝트의 개념, 생성 및 구성 방법](multiplatform-discover-project.md)에 대해 알아보세요.

## ID 및 버전

Kotlin 멀티플랫폼 Gradle 플러그인의 정규화된 이름은 `org.jetbrains.kotlin.multiplatform`입니다.
Kotlin Gradle DSL을 사용하는 경우 `kotlin("multiplatform")`을 사용하여 플러그인을 적용할 수 있습니다.
플러그인 버전은 Kotlin 릴리스 버전과 일치합니다. 최신 버전은 %kotlinVersion%입니다.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
}
```

</TabItem>
</Tabs>

## 최상위 블록

`kotlin {}`은 Gradle 빌드 스크립트에서 멀티플랫폼 프로젝트 구성을 위한 최상위 블록입니다.
`kotlin {}` 내부에 다음 블록을 작성할 수 있습니다:

| **블록**            | **설명**                                                                                                                         |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| _&lt;targetName&gt;_ | 프로젝트의 특정 타겟을 선언합니다. 사용 가능한 타겟의 이름은 [타겟](#targets) 섹션에 나열되어 있습니다.                         |
| `targets`            | 프로젝트의 모든 타겟을 나열합니다.                                                                                                |
| `sourceSets`         | 프로젝트의 사전 정의된 [소스 세트](#source-sets)를 구성하고 사용자 정의 소스 세트를 선언합니다.                                     |
| `compilerOptions`    | 모든 타겟 및 공유 소스 세트의 기본값으로 사용되는 공통 확장 수준 [컴파일러 옵션](#compiler-options)을 지정합니다.              |
| `dependencies`       | [최상위에서 공통 의존성](#configure-dependencies-at-the-top-level)을 구성합니다. (실험적)                                            |

## 타겟

_타겟_은 지원되는 플랫폼 중 하나를 대상으로 하는 소프트웨어 조각을 컴파일, 테스트 및 패키징하는 빌드의 일부입니다.
Kotlin은 각 플랫폼에 대한 타겟을 제공하므로, Kotlin에게 해당 특정 타겟에 대한 코드를 컴파일하도록 지시할 수 있습니다. [타겟 설정](multiplatform-discover-project.md#targets)에 대해 자세히 알아보세요.

각 타겟은 하나 이상의 [컴파일](#compilations)을 가질 수 있습니다. 테스트 및 프로덕션 목적을 위한 기본 컴파일 외에도 [사용자 정의 컴파일을 생성](multiplatform-configure-compilations.md#create-a-custom-compilation)할 수 있습니다.

멀티플랫폼 프로젝트의 타겟은 `kotlin {}` 내부의 해당 블록에 설명되어 있습니다. 예를 들어 `jvm`, `android`, `iosArm64` 등이 있습니다.
사용 가능한 타겟의 전체 목록은 다음과 같습니다.

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
        <td>프로젝트를 JavaScript 런타임에서 실행할 계획이라면 사용하세요.</td>
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
                <li>브라우저에서 실행되는 애플리케이션용 <code>browser {}</code>.</li>
                <li>Node.js에서 실행되는 애플리케이션용 <code>nodejs {}</code>.</li>
            </list>
            <p><a href="https://kotlinlang.org/docs/js-project-setup.html#execution-environments">Kotlin/JS 프로젝트 설정</a>에서 자세히 알아보세요.</p>
        </td>
</tr>

<tr>
<td>Kotlin/Native</td>
        <td></td>
        <td>
            <p><a href="https://kotlinlang.org/docs/native-target-support.html">Kotlin/Native 타겟 지원</a>에서 macOS, Linux, Windows 호스트에 대해 현재 지원되는 타겟에 대해 알아보세요.</p>
        </td>
</tr>

<tr>
<td>Android 애플리케이션 및 라이브러리</td>
        <td><code>android</code></td>
        <td>
            <p>Android Gradle 플러그인: <code>com.android.application</code> 또는 <code>com.android.kotlin.multiplatform.library</code>를 수동으로 적용하세요.</p>
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

타겟의 구성은 다음 두 가지 부분을 포함할 수 있습니다:

*   모든 타겟에서 사용 가능한 [공통 타겟 구성](#common-target-configuration).
*   타겟별 구성.

각 타겟은 하나 이상의 [컴파일](#compilations)을 가질 수 있습니다.

### 공통 타겟 구성

모든 타겟 블록에서 다음 선언을 사용할 수 있습니다:

| **이름**            | **설명**                                                                                                                                                                                   |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `platformType`      | 이 타겟을 위한 Kotlin 플랫폼. 사용 가능한 값: `jvm`, `androidJvm`, `js`, `wasm`, `native`, `common`.                                                                              |
| `artifactsTaskName` | 이 타겟의 결과 아티팩트를 빌드하는 태스크의 이름.                                                                                                                                          |
| `components`        | Gradle 게시를 설정하는 데 사용되는 컴포넌트.                                                                                                                                             |
| `compilerOptions`   | 타겟에 사용되는 [컴파일러 옵션](#compiler-options). 이 선언은 [최상위](multiplatform-dsl-reference.md#top-level-blocks)에서 구성된 모든 `compilerOptions {}`를 재정의합니다. |

### 웹 타겟

`js {}` 블록은 Kotlin/JS 타겟의 구성을 설명하고, `wasmJs {}` 블록은 JavaScript와 상호 운용되는 Kotlin/Wasm 타겟의 구성을 설명합니다. 이 블록들은 타겟 실행 환경에 따라 두 가지 블록 중 하나를 포함할 수 있습니다:

| **이름**              | **설명**               |
|-----------------------|------------------------|
| [`browser`](#browser) | 브라우저 타겟 구성.      |
| [`nodejs`](#node-js)  | Node.js 타겟 구성.     |

[Kotlin/JS 프로젝트 구성](https://kotlinlang.org/docs/js-project-setup.html)에 대해 자세히 알아보세요.

별도의 `wasmWasi {}` 블록은 WASI 시스템 인터페이스를 지원하는 Kotlin/Wasm 타겟의 구성을 설명합니다. 여기서는 [`nodejs`](#node-js) 실행 환경만 사용 가능합니다:

```kotlin
kotlin {
    wasmWasi {
        nodejs()
        binaries.executable()
    }
}
```

모든 웹 타겟(`js`, `wasmJs`, `wasmWasi`)은 `binaries.executable()` 호출도 지원합니다. 이는 Kotlin 컴파일러가 실행 파일을 내보내도록 명시적으로 지시합니다. 자세한 내용은 Kotlin/JS 문서의 [실행 환경](https://kotlinlang.org/docs/js-project-setup.html#execution-environments)을 참조하세요.

#### 브라우저

`browser {}`는 다음 구성 블록을 포함할 수 있습니다:

| **이름**       | **설명**                                         |
|----------------|--------------------------------------------------|
| `testRuns`     | 테스트 실행 구성.                                |
| `runTask`      | 프로젝트 실행 구성.                              |
| `webpackTask`  | [Webpack](https://webpack.js.org/)을 사용한 프로젝트 번들링 구성. |
| `distribution` | 출력 파일 경로.                                |

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

`nodejs {}`는 테스트 및 실행 태스크 구성을 포함할 수 있습니다:

| **이름**   | **설명**               |
|------------|------------------------|
| `testRuns` | 테스트 실행 구성.      |
| `runTask`  | 프로젝트 실행 구성.    |

```kotlin
kotlin {
    js().nodejs {
        runTask { /* ... */ }
        testRuns { /* ... */ }
    }
}
```

### 네이티브 타겟

네이티브 타겟의 경우 다음 특정 블록을 사용할 수 있습니다:

| **이름**    | **설명**                                      |
|-------------|-----------------------------------------------|
| `binaries`  | 생성할 [바이너리](#binaries) 구성.            |
| `cinterops` | [C 라이브러리와의 상호 운용](#cinterops) 구성. |

#### 바이너리

다음과 같은 종류의 바이너리가 있습니다:

| **이름**     | **설명**       |
|--------------|----------------|
| `executable` | 제품 실행 파일.    |
| `test`       | 테스트 실행 파일.  |
| `sharedLib`  | 공유 라이브러리.   |
| `staticLib`  | 정적 라이브러리.   |
| `framework`  | Objective-C 프레임워크. |

```kotlin
kotlin {
    linuxX64 { // 대신 사용할 타겟을 지정하세요.
        binaries {
            executable {
                // Binary configuration.
            }
        }
    }
}
```

바이너리 구성에 대해 다음 매개변수를 사용할 수 있습니다:

| **이름**      | **설명**                                                                                                                                                                                 |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `compilation` | 바이너리가 빌드되는 컴파일. 기본적으로 테스트 바이너리는 `test` 컴파일을 기반으로 하며, 다른 바이너리는 `main` 컴파일을 기반으로 합니다.                                                      |
| `linkerOpts`  | 바이너리 빌드 중에 시스템 링커에 전달되는 옵션.                                                                                                                                        |
| `baseName`    | 출력 파일의 사용자 정의 기본 이름. 최종 파일 이름은 이 기본 이름에 시스템 종속적인 접두사와 접미사를 추가하여 형성됩니다.                                                                 |
| `entryPoint`  | 실행 파일 바이너리의 진입점 함수. 기본적으로 루트 패키지의 `main()`입니다.                                                                                                                |
| `outputFile`  | 출력 파일에 대한 접근.                                                                                                                                                                   |
| `linkTask`    | 링크 태스크에 대한 접근.                                                                                                                                                                 |
| `runTask`     | 실행 파일 바이너리에 대한 실행 태스크 접근. `linuxX64`, `macosX64`, `mingwX64` 이외의 타겟의 경우 값은 `null`입니다.                                                                       |
| `isStatic`    | Objective-C 프레임워크용. 동적 라이브러리 대신 정적 라이브러리를 포함합니다.                                                                                                             |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("my_executable", listOf(RELEASE)) {
        // 테스트 컴파일을 기반으로 바이너리를 빌드합니다.
        compilation = compilations["test"]

        // 링커를 위한 사용자 정의 명령줄 옵션.
        linkerOpts = mutableListOf("-L/lib/search/path", "-L/another/search/path", "-lmylib")

        // 출력 파일의 기본 이름.
        baseName = "foo"

        // 사용자 정의 진입점 함수.
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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('my_executable', [RELEASE]) {
        // 테스트 컴파일을 기반으로 바이너리를 빌드합니다.
        compilation = compilations.test

        // 링커를 위한 사용자 정의 명령줄 옵션.
        linkerOpts = ['-L/lib/search/path', '-L/another/search/path', '-lmylib']

        // 출력 파일의 기본 이름.
        baseName = 'foo'

        // 사용자 정의 진입점 함수.
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

</TabItem>
</Tabs>

[네이티브 바이너리 빌드](multiplatform-build-native-binaries.md)에 대해 자세히 알아보세요.

#### Cinterops

`cinterops`는 네이티브 라이브러리와의 상호 운용에 대한 설명 모음입니다.
라이브러리와의 상호 운용을 제공하려면 `cinterops`에 항목을 추가하고 매개변수를 정의하세요:

| **이름**         | **설명**                                    |
|------------------|---------------------------------------------|
| `definitionFile` | 네이티브 API를 설명하는 `.def` 파일.        |
| `packageName`    | 생성된 Kotlin API를 위한 패키지 접두사.     |
| `compilerOpts`   | cinterop 도구에 의해 컴파일러에 전달될 옵션. |
| `includeDirs`    | 헤더를 찾을 디렉터리.                       |
| `header`         | 바인딩에 포함될 헤더.                       |
| `headers`        | 바인딩에 포함될 헤더 목록.                  |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    linuxX64 { // 필요한 타겟으로 대체하세요.
        compilations.getByName("main") {
            val myInterop by cinterops.creating {
                // 네이티브 API를 설명하는 정의 파일.
                // 기본 경로는 src/nativeInterop/cinterop/<interop-name>.def입니다.
                definitionFile.set(project.file("def-file.def"))

                // 생성된 Kotlin API를 배치할 패키지.
                packageName("org.sample")

                // cinterop 도구에 의해 컴파일러에 전달될 옵션.
                compilerOpts("-Ipath/to/headers")

                // 헤더 검색을 위한 디렉터리(—I<path> 컴파일러 옵션과 유사).
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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    linuxX64 { // 필요한 타겟으로 대체하세요.
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

                    // 헤더 검색을 위한 디렉터리(—I<path> 컴파일러 옵션과 유사).
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

</TabItem>
</Tabs>

더 많은 cinterop 속성에 대해서는 [정의 파일](https://kotlinlang.org/docs/native-definition-file.html#properties)을 참조하세요.

### Android 타겟

Kotlin 멀티플랫폼 Gradle 플러그인에는 Android 타겟의 [빌드 변형](https://developer.android.com/studio/build/build-variants)을 구성하는 데 도움이 되는 특정 함수가 있습니다:

| **이름**                      | **설명**                                                                                                                                          |
|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| `publishLibraryVariants()`    | 게시할 빌드 변형을 지정합니다. [Android 라이브러리 게시](multiplatform-publish-lib-setup.md#publish-an-android-library)에 대해 자세히 알아보세요. |

```kotlin
kotlin {
    android {
        publishLibraryVariants("release")
    }
}
```

[Android용 컴파일](multiplatform-configure-compilations.md#compilation-for-android)에 대해 자세히 알아보세요.

> `kotlin {}` 블록 내부의 `android` 구성은 어떤 Android 프로젝트의 빌드 구성도 대체하지 않습니다. `Android 개발자 문서`에서 Android 프로젝트용 빌드 스크립트 작성에 대해 자세히 알아보세요.
>
{style="note"}

## 소스 세트

`sourceSets {}` 블록은 프로젝트의 소스 세트를 설명합니다. 소스 세트는 리소스 및 의존성과 함께 컴파일에 참여하는 Kotlin 소스 파일을 포함합니다.

멀티플랫폼 프로젝트는 타겟을 위한 [사전 정의된](#predefined-source-sets) 소스 세트를 포함하며, 개발자는 필요에 따라 [사용자 정의](#custom-source-sets) 소스 세트를 생성할 수도 있습니다.

### 사전 정의된 소스 세트

사전 정의된 소스 세트는 멀티플랫폼 프로젝트 생성 시 자동으로 설정됩니다. 사용 가능한 사전 정의된 소스 세트는 다음과 같습니다:

| **이름**                                    | **설명**                                                                                                                                                                                       |
|---------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `commonMain`                                | 모든 플랫폼 간에 공유되는 코드 및 리소스. 모든 멀티플랫폼 프로젝트에서 사용 가능. 프로젝트의 모든 `main` [컴파일](#compilations)에서 사용됩니다.                                         |
| `commonTest`                                | 모든 플랫폼 간에 공유되는 테스트 코드 및 리소스. 모든 멀티플랫폼 프로젝트에서 사용 가능. 프로젝트의 모든 테스트 컴파일에서 사용됩니다.                                                     |
| _&lt;targetName&gt;&lt;compilationName&gt;_ | 컴파일을 위한 타겟별 소스. _&lt;targetName&gt;_은 사전 정의된 타겟의 이름이고, _&lt;compilationName&gt;_은 이 타겟의 컴파일 이름입니다. 예시: `jsTest`, `jvmMain`. |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain { /* ... */ }
    }
}
```

</TabItem>
</Tabs>

[소스 세트](multiplatform-discover-project.md#source-sets)에 대해 자세히 알아보세요.

### 사용자 정의 소스 세트

사용자 정의 소스 세트는 프로젝트 개발자가 수동으로 생성합니다. 사용자 정의 소스 세트를 생성하려면 `sourceSets` 섹션 내부에 해당 이름으로 섹션을 추가하세요. Kotlin Gradle DSL을 사용하는 경우, 사용자 정의 소스 세트를 `by creating`으로 표시하세요.

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        val myMain by creating { /* ... */ } // 'MyMain'이라는 이름으로 새 소스 세트 생성
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        myMain { /* ... */ } // 'myMain'이라는 이름으로 소스 세트 생성 또는 구성
    }
}
```

</TabItem>
</Tabs>

새로 생성된 소스 세트는 다른 소스 세트와 연결되지 않습니다. 프로젝트의 컴파일에서 사용하려면 [다른 소스 세트와 연결](multiplatform-hierarchy.md#manual-configuration)하세요.

### 소스 세트 매개변수

소스 세트의 구성은 `sourceSets {}`의 해당 블록 내부에 저장됩니다. 소스 세트는 다음 매개변수를 가집니다:

| **이름**           | **설명**                                       |
|--------------------|------------------------------------------------|
| `kotlin.srcDir`    | 소스 세트 디렉터리 내 Kotlin 소스 파일 위치.   |
| `resources.srcDir` | 소스 세트 디렉터리 내 리소스 위치.             |
| `dependsOn`        | [다른 소스 세트와의 연결](multiplatform-hierarchy.md#manual-configuration). |
| `dependencies`     | 소스 세트의 [의존성](#dependencies).           |
| `languageSettings` | 공유 소스 세트에 적용되는 [언어 설정](#language-settings). |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

## 컴파일

타겟은 예를 들어 프로덕션 또는 테스트를 위해 하나 이상의 컴파일을 가질 수 있습니다. 타겟 생성 시 자동으로 추가되는 [사전 정의된 컴파일](#predefined-compilations)이 있습니다. 추가로 [사용자 정의 컴파일](#custom-compilations)을 생성할 수도 있습니다.

타겟의 모든 컴파일 또는 특정 컴파일을 참조하려면 `compilations` 객체 컬렉션을 사용하세요. `compilations`에서 이름으로 컴파일을 참조할 수 있습니다.

[컴파일 구성](multiplatform-configure-compilations.md)에 대해 자세히 알아보세요.

### 사전 정의된 컴파일

사전 정의된 컴파일은 Android 타겟을 제외한 프로젝트의 각 타겟에 대해 자동으로 생성됩니다. 사용 가능한 사전 정의된 컴파일은 다음과 같습니다:

| **이름** | **설명**             |
|----------|----------------------|
| `main`   | 프로덕션 소스용 컴파일. |
| `test`   | 테스트용 컴파일.     |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main.output // 메인 컴파일 출력 가져오기
        compilations.test.runtimeDependencyFiles // 테스트 런타임 클래스패스 가져오기
    }
}
```

</TabItem>
</Tabs>

### 사용자 정의 컴파일

사전 정의된 컴파일 외에도 자신만의 사용자 정의 컴파일을 생성할 수 있습니다. 이를 위해 새 컴파일과 `main` 컴파일 사이에 [`associateWith`](https://kotlinlang.org/docs/gradle-configure-project.html#associate-compiler-tasks) 관계를 설정하세요. Kotlin Gradle DSL을 사용하는 경우, 사용자 정의 컴파일을 `by creating`으로 표시하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations {
            val main by getting
            val integrationTest by creating {
                // main과 그 클래스패스를 의존성으로 임포트하고 내부 가시성 설정
                associateWith(main)
                defaultSourceSet {
                    dependencies {
                        implementation(kotlin("test-junit"))
                        /* ... */
                    }
                }

                // 이 컴파일에 의해 생성된 테스트를 실행하기 위한 테스트 태스크 생성
                testRuns.create("integration") {
                    // 테스트 태스크 구성
                    setExecutionSourceFrom(integrationTest)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.create('integrationTest') {
            def main = compilations.main
            // main과 그 클래스패스를 의존성으로 임포트하고 내부 가시성 설정
            associateWith(main)
            defaultSourceSet {
                dependencies {
                    implementation kotlin('test-junit')
                    /* ... */
                }
            }

            // 이 컴파일에 의해 생성된 테스트를 실행하기 위한 테스트 태스크 생성
            testRuns.create('integration') {
                // 테스트 태스크 구성
                setExecutionSourceFrom(compilations.integrationTest)
            }
        }
    }
}
```

</TabItem>
</Tabs>

컴파일을 연결함으로써 `main` 컴파일 출력을 의존성으로 추가하고 컴파일 간에 `internal` 가시성을 설정합니다.

[사용자 정의 컴파일 생성](multiplatform-configure-compilations.md#create-a-custom-compilation)에 대해 자세히 알아보세요.

### 컴파일 매개변수

컴파일은 다음 매개변수를 가집니다:

| **이름**                 | **설명**                                                                                                                                                                        |
|--------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `defaultSourceSet`       | 컴파일의 기본 소스 세트.                                                                                                                                                       |
| `kotlinSourceSets`       | 컴파일에 참여하는 소스 세트.                                                                                                                                                   |
| `allKotlinSourceSets`    | 컴파일에 참여하는 소스 세트 및 `dependsOn()`을 통한 연결.                                                                                                                      |
| `compilerOptions`        | 컴파일에 적용되는 컴파일러 옵션. 사용 가능한 옵션 목록은 [컴파일러 옵션](https://kotlinlang.org/docs/gradle-compiler-options.html)을 참조하세요.                                |
| `compileKotlinTask`      | Kotlin 소스를 컴파일하기 위한 Gradle 태스크.                                                                                                                                  |
| `compileKotlinTaskName`  | `compileKotlinTask`의 이름.                                                                                                                                                     |
| `compileAllTaskName`     | 컴파일의 모든 소스를 컴파일하기 위한 Gradle 태스크의 이름.                                                                                                                    |
| `output`                 | 컴파일 출력.                                                                                                                                                                    |
| `compileDependencyFiles` | 컴파일의 컴파일 시점 의존성 파일(클래스패스). 모든 Kotlin/Native 컴파일의 경우, 표준 라이브러리 및 플랫폼 의존성을 자동으로 포함합니다. |
| `runtimeDependencyFiles` | 컴파일의 런타임 의존성 파일(클래스패스).                                                                                                                                        |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        val main by compilations.getting {
            compileTaskProvider.configure {
                compilerOptions {
                    // 'main' 컴파일에 대한 Kotlin 컴파일러 옵션 설정:
                    jvmTarget.set(JvmTarget.JVM_1_8)
                }
            }

            compileKotlinTask // Kotlin 태스크 'compileKotlinJvm' 가져오기
            output // 메인 컴파일 출력 가져오기
        }

        compilations["test"].runtimeDependencyFiles // 테스트 런타임 클래스패스 가져오기
    }

    // 모든 타겟의 모든 컴파일 구성:
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.main {
            compileTaskProvider.configure {
                compilerOptions {
                    // 'main' 컴파일에 대한 Kotlin 컴파일러 옵션 설정:
                    jvmTarget = JvmTarget.JVM_1_8
                }
            }
        }

        compilations.main.compileKotlinTask // Kotlin 태스크 'compileKotlinJvm' 가져오기
        compilations.main.output // 메인 컴파일 출력 가져오기
        compilations.test.runtimeDependencyFiles // 테스트 런타임 클래스패스 가져오기
    }

    // 모든 타겟의 모든 컴파일 구성:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

## 컴파일러 옵션

프로젝트에서 컴파일러 옵션을 세 가지 다른 수준으로 구성할 수 있습니다:

*   **확장 수준**, `kotlin {}` 블록에서.
*   **타겟 수준**, 타겟 블록에서.
*   **컴파일 단위 수준**, 일반적으로 특정 컴파일 태스크에서.

![Kotlin 컴파일러 옵션 수준](compiler-options-levels.svg){width=700}

상위 수준의 설정은 하위 수준의 기본값으로 작동합니다:

*   확장 수준에서 설정된 컴파일러 옵션은 `commonMain`, `nativeMain`, `commonTest`와 같은 공유 소스 세트를 포함하여 타겟 수준 옵션의 기본값입니다.
*   타겟 수준에서 설정된 컴파일러 옵션은 `compileKotlinJvm` 및 `compileTestKotlinJvm` 태스크와 같은 컴파일 단위(태스크) 수준 옵션의 기본값입니다.

하위 수준에서 이루어진 구성은 상위 수준의 유사한 설정을 재정의합니다:

*   태스크 수준 컴파일러 옵션은 타겟 또는 확장 수준의 유사한 설정을 재정의합니다.
*   타겟 수준 컴파일러 옵션은 확장 수준의 유사한 설정을 재정의합니다.

가능한 컴파일러 옵션 목록은 [모든 컴파일러 옵션](https://kotlinlang.org/docs/gradle-compiler-options.html#all-compiler-options)을 참조하세요.

### 확장 수준

프로젝트의 모든 타겟에 대한 컴파일러 옵션을 구성하려면 최상위에서 `compilerOptions {}` 블록을 사용하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    // 모든 타겟의 모든 컴파일 구성
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    // 모든 타겟의 모든 컴파일 구성:
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

### 타겟 수준

프로젝트의 특정 타겟에 대한 컴파일러 옵션을 구성하려면 타겟 블록 내부에 `compilerOptions {}` 블록을 사용하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        // JVM 타겟의 모든 컴파일 구성
        compilerOptions {
            allWarningsAsErrors.set(true)
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        // JVM 타겟의 모든 컴파일 구성
        compilerOptions {
            allWarningsAsErrors = true
        }
    }
}
```

</TabItem>
</Tabs>

### 컴파일 단위 수준

특정 태스크에 대한 컴파일러 옵션을 구성하려면 태스크 내부에 `compilerOptions {}` 블록을 사용하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors.set(true)
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
task.named<KotlinJvmCompile>("compileKotlinJvm") {
    compilerOptions {
        allWarningsAsErrors = true
    }
}
```

</TabItem>
</Tabs>

특정 컴파일에 대한 컴파일러 옵션을 구성하려면 컴파일의 태스크 제공자(task provider) 내부에 `compilerOptions {}` 블록을 사용하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' 컴파일 구성:
                compilerOptions {
                    allWarningsAsErrors.set(true)
                }
            }
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    jvm {
        compilations.named(KotlinCompilation.MAIN_COMPILATION_NAME) {
            compileTaskProvider.configure {
                // 'main' 컴파일 구성:
                compilerOptions {
                    allWarningsAsErrors = true
                }
            }
        }
    }
}
```

</TabItem>
</Tabs>

### `kotlinOptions {}`에서 `compilerOptions {}`로 마이그레이션 {collapsible="true"}

Kotlin 2.2.0 이전에는 `kotlinOptions {}` 블록을 사용하여 컴파일러 옵션을 구성할 수 있었습니다. Kotlin 2.2.0에서 `kotlinOptions {}` 블록이 사용 중단(deprecated)되었으므로, 대신 빌드 스크립트에서 `compilerOptions {}` 블록을 사용해야 합니다. 자세한 내용은 [`kotlinOptions{}`에서 `compilerOptions{}`로 마이그레이션](https://kotlinlang.org/docs/gradle-compiler-options.html#migrate-from-kotlinoptions-to-compileroptions)을 참조하세요.

## 의존성

소스 세트 선언의 `dependencies {}` 블록은 이 소스 세트의 의존성을 포함합니다.

[의존성 구성](https://kotlinlang.org/docs/gradle-configure-project.html)에 대해 자세히 알아보세요.

네 가지 유형의 의존성이 있습니다:

| **이름**         | **설명**                                          |
|------------------|---------------------------------------------------|
| `api`            | 현재 모듈의 API에서 사용되는 의존성.             |
| `implementation` | 모듈에서 사용되지만 외부에 노출되지 않는 의존성. |
| `compileOnly`    | 현재 모듈 컴파일에만 사용되는 의존성.             |
| `runtimeOnly`    | 런타임에 사용 가능하지만 어떤 모듈의 컴파일 중에는 보이지 않는 의존성. |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

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

</TabItem>
<TabItem title="Groovy" group-key="groovy">

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

</TabItem>
</Tabs>

또한, 소스 세트는 서로 의존하며 계층 구조를 형성할 수 있습니다.
이 경우 [`dependsOn()`](#source-set-parameters) 관계가 사용됩니다.

### 최상위에서 의존성 구성
<primary-label ref="Experimental"/>

최상위 `dependencies {}` 블록을 사용하여 공통 의존성을 구성할 수 있습니다. 여기서 선언된 의존성은 `commonMain` 또는 `commonTest` 소스 세트에 추가된 것처럼 작동합니다.

최상위 `dependencies {}` 블록을 사용하려면 블록 앞에 `@OptIn(ExperimentalKotlinGradlePluginApi::class)` 어노테이션을 추가하여 옵트인(opt-in)하세요:

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    @OptIn(ExperimentalKotlinGradlePluginApi::class)
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
    }
}
```

</TabItem>
</Tabs>

해당 타겟의 `sourceSets {}` 블록 내부에 플랫폼별 의존성을 추가하세요.

이 기능에 대한 의견은 [YouTrack](https://youtrack.jetbrains.com/issue/KT-76446)에서 공유할 수 있습니다.

## 언어 설정

소스 세트의 `languageSettings {}` 블록은 프로젝트 분석 및 컴파일의 특정 측면을 정의합니다. `languageSettings {}` 블록은 공유 소스 세트에 특별히 적용되는 설정을 구성할 때만 사용하세요. 다른 모든 경우에는 확장 또는 타겟 수준에서 [컴파일러 옵션](#compiler-options)을 구성하기 위해 `compilerOptions {}` 블록을 사용하세요.

다음 언어 설정을 사용할 수 있습니다:

| **이름**                | **설명**                                                                                                                                                                                               |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `languageVersion`       | 지정된 Kotlin 버전과의 소스 호환성을 제공합니다.                                                                                                                                                     |
| `apiVersion`            | 지정된 버전의 Kotlin 번들 라이브러리에서만 선언을 사용할 수 있도록 합니다.                                                                                                                            |
| `enableLanguageFeature` | 지정된 언어 기능을 활성화합니다. 사용 가능한 값은 현재 실험적이거나 특정 시점에 그렇게 도입된 언어 기능에 해당합니다. |
| `optIn`                 | 지정된 [옵트인(opt-in) 어노테이션](https://kotlinlang.org/docs/opt-in-requirements.html)을 사용할 수 있도록 합니다.                                                                                   |
| `progressiveMode`       | [프로그레시브 모드](https://kotlinlang.org/docs/whatsnew13.html#progressive-mode)를 활성화합니다.                                                                                                    |

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    sourceSets.all {
        languageSettings.apply {
            languageVersion = "%languageVersion%" // 가능한 값: "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL)
            apiVersion = "%apiVersion%" // 가능한 값: "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL)
            enableLanguageFeature("InlineClasses") // 언어 기능 이름
            optIn("kotlin.ExperimentalUnsignedTypes") // 어노테이션 정규화된 이름
            progressiveMode = true // 기본값은 false
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets.all {
        languageSettings {
            languageVersion = '%languageVersion%' // 가능한 값: '2.0', '2.1', '2.2', '2.3', '2.4' (EXPERIMENTAL)
            apiVersion = '%apiVersion%' // 가능한 값: '2.0', '2.1', '2.2', '2.3', '2.4' (EXPERIMENTAL)
            enableLanguageFeature('InlineClasses') // 언어 기능 이름
            optIn('kotlin.ExperimentalUnsignedTypes') // 어노테이션 정규화된 이름
            progressiveMode = true // 기본값은 false
        }
    }
}
```

</TabItem>
</Tabs>