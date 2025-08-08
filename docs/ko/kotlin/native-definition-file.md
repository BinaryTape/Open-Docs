[//]: # (title: 정의 파일)

Kotlin/Native를 사용하면 C 및 Objective-C 라이브러리를 사용할 수 있으며, 이를 통해 Kotlin에서 해당 기능을 활용할 수 있습니다. `cinterop`이라는 특수 도구는 C 또는 Objective-C 라이브러리를 받아 해당 Kotlin 바인딩을 생성하므로, 라이브러리의 메서드를 Kotlin 코드에서 평소처럼 사용할 수 있습니다.

이러한 바인딩을 생성하려면 각 라이브러리에는 정의 파일이 필요하며, 일반적으로 라이브러리와 동일한 이름을 가집니다. 이는 라이브러리가 어떻게 사용되어야 하는지 정확히 설명하는 속성 파일입니다. 사용 가능한 속성 전체 목록은 [여기](#properties)를 참조하세요.

프로젝트 작업 시 일반적인 작업 흐름은 다음과 같습니다:

1. 바인딩에 포함할 내용을 설명하는 `.def` 파일을 생성합니다.
2. Kotlin 코드에서 생성된 바인딩을 사용합니다.
3. Kotlin/Native 컴파일러를 실행하여 최종 실행 파일을 생성합니다.

## 정의 파일 생성 및 구성

C 라이브러리용 정의 파일을 생성하고 바인딩을 만들어 봅시다:

1. IDE에서 `src` 폴더를 선택하고, **File | New | Directory**를 사용하여 새 디렉터리를 생성합니다.
2. 새 디렉터리 이름을 `nativeInterop/cinterop`으로 지정합니다.
   
   이는 `.def` 파일 위치에 대한 기본 규칙이지만, 다른 위치를 사용하는 경우 `build.gradle.kts` 파일에서 재정의할 수 있습니다.
3. 새 하위 폴더를 선택하고, **File | New | File**을 사용하여 `png.def` 파일을 생성합니다.
4. 필요한 속성을 추가합니다:

   ```none
   headers = png.h
   headerFilter = png.h
   package = png
   
   compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
   linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
   linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
   ```

   * `headers`는 Kotlin 스텁을 생성할 헤더 파일 목록입니다. 이 항목에 여러 파일을 추가할 수 있으며, 각 파일은 공백으로 구분합니다. 이 경우 `png.h`만 해당합니다. 참조된 파일은 지정된 경로(이 경우 `/usr/include/png`)에서 사용할 수 있어야 합니다.
   * `headerFilter`는 정확히 무엇이 포함되는지 보여줍니다. C에서는 하나의 파일이 `#include` 지시어로 다른 파일을 참조할 때 모든 헤더도 포함됩니다. 때로는 이것이 필요하지 않을 수 있으며, [글롭(glob) 패턴을 사용하여](https://en.wikipedia.org/wiki/Glob_(programming)) 이 매개변수를 추가하여 조정할 수 있습니다.

     `headerFilter`는 외부 종속성(예: 시스템 `stdint.h` 헤더)을 인터롭 라이브러리에 가져오지 않으려는 경우 사용할 수 있습니다. 또한 라이브러리 크기 최적화 및 시스템과 제공된 Kotlin/Native 컴파일 환경 간의 잠재적 충돌 해결에 유용할 수 있습니다.

   * 특정 플랫폼의 동작을 수정해야 하는 경우, `compilerOpts.osx` 또는 `compilerOpts.linux`와 같은 형식을 사용하여 옵션에 플랫폼별 값을 제공할 수 있습니다. 이 경우 macOS(`.osx` 접미사) 및 Linux(`.linux` 접미사)입니다. 접미사가 없는 매개변수도 가능하며(예: `linkerOpts=`), 모든 플랫폼에 적용됩니다.

5. 바인딩을 생성하려면 알림에서 **Sync Now**를 클릭하여 Gradle 파일을 동기화합니다.

   ![Synchronize the Gradle files](gradle-sync.png)

바인딩 생성 후 IDE는 이를 네이티브 라이브러리의 프록시 뷰로 사용할 수 있습니다.

> 명령줄에서 [cinterop 도구](#generate-bindings-using-command-line)를 사용하여 바인딩 생성을 구성할 수도 있습니다.
> 
{style="tip"}

## 속성

여기 생성된 바이너리의 내용을 조정하기 위해 정의 파일에서 사용할 수 있는 속성의 전체 목록이 있습니다. 자세한 내용은 아래 해당 섹션을 참조하세요.

| **속성**                                                                        | **설명**                                                                                                                                                                                                          |
|:------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | 바인딩에 포함될 라이브러리의 헤더 목록입니다.                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | 바인딩에 포함될 Objective-C 라이브러리의 Clang 모듈 목록입니다.                                                                                                                                    |
| `language`                                                                          | 언어를 지정합니다. 기본적으로 C가 사용되며, 필요한 경우 `Objective-C`로 변경합니다.                                                                                                                                      |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop 도구가 C 컴파일러에 전달하는 컴파일러 옵션입니다.                                                                                                                                                        |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop 도구가 링커에 전달하는 링커 옵션입니다.                                                                                                                                                              |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 무시해야 할 함수 이름의 공백으로 구분된 목록입니다.                                                                                                                                                         |                                              
| [`staticLibraries`](#include-a-static-library)                                      | [실험적](components-stability.md#stability-levels-explained). 정적 라이브러리를 `.klib`에 포함합니다.                                                                                                              |
| [`libraryPaths`](#include-a-static-library)                                         | [실험적](components-stability.md#stability-levels-explained). cinterop 도구가 `.klib`에 포함될 라이브러리를 검색하는 디렉터리 목록(공백으로 구분)입니다.                                    |
| `packageName`                                                                       | 생성된 Kotlin API의 패키지 접두사입니다.                                                                                                                                                                             |
| [`headerFilter`](#filter-headers-by-globs)                                          | 글롭(glob)을 기준으로 헤더를 필터링하고 라이브러리를 임포트할 때 해당 헤더만 포함합니다.                                                                                                                                                |
| [`excludeFilter`](#exclude-headers)                                                 | 라이브러리를 임포트할 때 특정 헤더를 제외하며, `headerFilter`보다 우선합니다.                                                                                                                               |
| [`strictEnums`](#configure-enums-generation)                                        | [Kotlin enum](enum-classes.md)으로 생성되어야 할 enum의 공백으로 구분된 목록입니다.                                                                                                                             |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 정수 값으로 생성되어야 할 enum의 공백으로 구분된 목록입니다.                                                                                                                                             |
| [`noStringConversion`](#set-up-string-conversion)                                   | `const char*` 파라미터가 Kotlin `String`으로 자동 변환되지 않아야 하는 함수의 공백으로 구분된 목록입니다.                                                                                                     |
| `allowedOverloadsForCFunctions`                                                     | 기본적으로 C 함수는 고유한 이름을 가진다고 가정합니다. 여러 함수가 동일한 이름을 가지는 경우, 하나만 선택됩니다. 그러나 이 함수들을 `allowedOverloadsForCFunctions`에 지정하여 이를 변경할 수 있습니다. |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 비지정 Objective-C 이니셜라이저를 `super()` 생성자로 호출하는 것을 허용하지 않는 컴파일러 검사를 비활성화합니다.                                                                                              |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | Objective-C 코드의 예외를 `ForeignException` 타입의 Kotlin 예외로 래핑합니다.                                                                                                                          |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | 예를 들어, 사용자가 링커 오류를 해결하는 데 도움이 되는 사용자 지정 메시지를 추가합니다.                                                                                                                  |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

속성 목록 외에도 정의 파일에 [사용자 정의 선언](#add-custom-declarations)을 포함할 수 있습니다.

### 헤더 임포트

C 라이브러리에 Clang 모듈이 없고 대신 헤더 집합으로 구성된 경우, `headers` 속성을 사용하여 임포트해야 할 헤더를 지정합니다:

```none
headers = curl/curl.h
```

#### 글롭(glob)을 기준으로 헤더 필터링

`.def` 파일의 필터 속성을 사용하여 글롭(glob)을 기준으로 헤더를 필터링할 수 있습니다. 헤더에서 선언을 포함하려면 `headerFilter` 속성을 사용합니다. 헤더가 어떤 글롭과도 일치하면 해당 선언이 바인딩에 포함됩니다.

글롭은 `time.h` 또는 `curl/curl.h`와 같이 적절한 포함(include) 경로 요소에 상대적인 헤더 경로에 적용됩니다. 따라서 라이브러리가 일반적으로 `#include <SomeLibrary/Header.h>`로 포함되는 경우, 다음 필터로 헤더를 필터링할 수 있습니다:

```none
headerFilter = SomeLibrary/**
```

`headerFilter`가 제공되지 않으면 모든 헤더가 포함됩니다. 그러나 `headerFilter`를 사용하고 글롭을 가능한 한 정확하게 지정하는 것을 권장합니다. 이 경우 생성된 라이브러리에는 필요한 선언만 포함됩니다. 이는 Kotlin 또는 개발 환경의 도구를 업그레이드할 때 발생할 수 있는 다양한 문제를 피하는 데 도움이 될 수 있습니다.

#### 헤더 제외

특정 헤더를 제외하려면 `excludeFilter` 속성을 사용합니다. 지정된 헤더의 선언이 바인딩에 포함되지 않으므로, 중복되거나 문제가 있는 헤더를 제거하고 컴파일을 최적화하는 데 도움이 될 수 있습니다:

```none
excludeFilter = SomeLibrary/time.h
```

> 동일한 헤더가 `headerFilter`로 포함되고 `excludeFilter`로 제외된 경우, 해당 헤더는 바인딩에 포함되지 않습니다.
>
{style="note"}

### 모듈 임포트

Objective-C 라이브러리에 Clang 모듈이 있는 경우, `modules` 속성을 사용하여 임포트할 모듈을 지정합니다:

```none
modules = UIKit
```

### 컴파일러 및 링커 옵션 전달

`compilerOpts` 속성을 사용하여 내부적으로 헤더를 분석하는 데 사용되는 C 컴파일러에 옵션을 전달합니다. 최종 실행 파일을 링크하는 데 사용되는 링커에 옵션을 전달하려면 `linkerOpts`를 사용합니다. 예시:

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

특정 타겟에만 적용되는 타겟별 옵션을 지정할 수도 있습니다:

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

이 구성으로 Linux에서는 `-DBAR=bar -DFOO=foo1`을 사용하여, macOS에서는 `-DBAR=bar -DFOO=foo2`를 사용하여 헤더를 분석합니다. 정의 파일 옵션은 공통 부분과 플랫폼별 부분을 모두 가질 수 있습니다.

### 특정 함수 무시

`excludedFunctions` 속성을 사용하여 무시해야 할 함수 이름 목록을 지정합니다. 이는 헤더에 선언된 함수가 호출 가능하다고 보장되지 않고, 이를 자동으로 결정하기 어렵거나 불가능한 경우에 유용할 수 있습니다. 이 속성을 사용하여 인터롭 자체의 버그를 해결할 수도 있습니다.

### 정적 라이브러리 포함

> 이 기능은 [실험적](components-stability.md#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다. 평가 목적으로만 사용하십시오.
>
{style="warning"}

때로는 사용자 환경에 정적 라이브러리가 있다고 가정하는 것보다 제품과 함께 제공하는 것이 더 편리합니다. 정적 라이브러리를 `.klib`에 포함하려면 `staticLibrary` 및 `libraryPaths` 속성을 사용합니다:

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

위 스니펫이 주어지면, `cinterop` 도구는 `/opt/local/lib` 및 `/usr/local/opt/curl/lib`에서 `libfoo.a`를 검색하고, 찾으면 해당 라이브러리 바이너리를 `klib`에 포함합니다.

프로그램에서 이와 같이 `klib`를 사용할 때, 라이브러리는 자동으로 링크됩니다.

### Enum 생성 구성

`strictEnums` 속성을 사용하여 enum을 Kotlin enum으로 생성하거나, `nonStrictEnums` 속성을 사용하여 정수 값으로 생성합니다. enum이 이 두 목록 중 어느 쪽에도 포함되지 않으면, 휴리스틱(heuristic)에 기반하여 생성됩니다.

### 문자열 변환 설정

`noStringConversion` 속성을 사용하여 `const char*` 함수 파라미터가 Kotlin `String`으로 자동 변환되는 것을 비활성화합니다.

### 비지정 이니셜라이저 호출 허용

기본적으로 Kotlin/Native 컴파일러는 비지정 Objective-C 이니셜라이저를 `super()` 생성자로 호출하는 것을 허용하지 않습니다. 이 동작은 지정된 Objective-C 이니셜라이저가 라이브러리에서 제대로 표시되지 않은 경우 불편할 수 있습니다. 이러한 컴파일러 검사를 비활성화하려면 `disableDesignatedInitializerChecks` 속성을 사용합니다.

### Objective-C 예외 처리

기본적으로 Objective-C 예외가 Objective-C-Kotlin 상호 운용 경계에 도달하여 Kotlin 코드에 전달되면 프로그램이 충돌합니다.

Objective-C 예외를 Kotlin으로 전파하려면, `foreignExceptionMode = objc-wrap` 속성을 사용하여 래핑(wrapping)을 활성화합니다. 이 경우 Objective-C 예외는 `ForeignException` 타입을 갖는 Kotlin 예외로 변환됩니다.

### 링커 오류 해결 지원

Kotlin 라이브러리가 C 또는 Objective-C 라이브러리에 의존하는 경우, 예를 들어 [CocoaPods 통합](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-cocoapods-overview.html)을 사용할 때 링커 오류가 발생할 수 있습니다. 종속 라이브러리가 로컬 머신에 설치되어 있지 않거나 프로젝트 빌드 스크립트에 명시적으로 구성되어 있지 않으면 "Framework not found" 오류가 발생합니다.

라이브러리 작성자라면 사용자 지정 메시지를 통해 사용자가 링커 오류를 해결하도록 도울 수 있습니다. 이렇게 하려면 `.def` 파일에 `userSetupHint=message` 속성을 추가하거나 `cinterop`에 `-Xuser-setup-hint` 컴파일러 옵션을 전달합니다.

### 사용자 정의 선언 추가

때로는 바인딩을 생성하기 전에 라이브러리에 사용자 정의 C 선언을 추가해야 할 수도 있습니다(예: [매크로](native-c-interop.md#macros)의 경우). 이러한 선언을 추가 헤더 파일로 만드는 대신, 구분자 시퀀스 `---`만 포함하는 구분선 뒤에 `.def` 파일 끝에 직접 포함할 수 있습니다:

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

`.def` 파일의 이 부분은 헤더 파일의 일부로 처리되므로, 본문이 있는 함수는 `static`으로 선언되어야 합니다. 선언은 `headers` 목록의 파일을 포함한 후에 파싱됩니다.

## 명령줄을 사용하여 바인딩 생성

정의 파일 외에도 `cinterop` 호출에서 해당 속성을 옵션으로 전달하여 바인딩에 무엇을 포함할지 지정할 수 있습니다.

다음은 `png.klib` 컴파일된 라이브러리를 생성하는 명령의 예시입니다:

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

생성된 바인딩은 일반적으로 플랫폼별(platform-specific)이므로, 여러 타겟을 개발하는 경우 바인딩을 재생성해야 합니다.

* 시스루트(sysroot) 검색 경로에 포함되지 않은 호스트 라이브러리의 경우, 헤더가 필요할 수 있습니다.
* 구성 스크립트가 있는 일반적인 UNIX 라이브러리의 경우, `compilerOpts`에는 `--cflags` 옵션(정확한 경로 없이)이 있는 구성 스크립트의 출력이 포함될 가능성이 높습니다.
* `--libs`가 있는 구성 스크립트의 출력은 `linkerOpts` 속성에 전달될 수 있습니다.

## 다음 단계

* [C 상호 운용성을 위한 바인딩](native-c-interop.md#bindings)
* [Swift/Objective-C와의 상호 운용성](native-objc-interop.md)