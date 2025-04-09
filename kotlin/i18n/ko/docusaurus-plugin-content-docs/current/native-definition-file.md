---
title: "정의 파일"
---
Kotlin/Native를 사용하면 C 및 Objective-C 라이브러리를 이용할 수 있어 Kotlin에서 해당 라이브러리의 기능을 사용할 수 있습니다.
cinterop이라는 특수 도구는 C 또는 Objective-C 라이브러리를 가져와 해당 Kotlin 바인딩을 생성하므로,
라이브러리의 메서드를 일반적인 Kotlin 코드에서처럼 사용할 수 있습니다.

이러한 바인딩을 생성하려면 각 라이브러리에 정의 파일이 필요하며, 일반적으로 라이브러리와 동일한 이름을 가집니다.
이 파일은 라이브러리를 사용하는 방법을 정확하게 설명하는 속성 파일입니다. 사용 가능한 [속성 목록](#properties)을 참조하십시오.

프로젝트 작업 시 일반적인 워크플로는 다음과 같습니다.

1. 바인딩에 포함할 내용을 설명하는 `.def` 파일을 만듭니다.
2. 생성된 바인딩을 Kotlin 코드에서 사용합니다.
3. Kotlin/Native 컴파일러를 실행하여 최종 실행 파일을 생성합니다.

## 정의 파일 생성 및 구성

정의 파일을 생성하고 C 라이브러리에 대한 바인딩을 생성해 보겠습니다.

1. IDE에서 `src` 폴더를 선택하고 **File | New | Directory**를 사용하여 새 디렉터리를 만듭니다.
2. 새 디렉터리의 이름을 `nativeInterop/cinterop`으로 지정합니다.
   
   이것은 `.def` 파일 위치에 대한 기본 규칙이지만, 다른 위치를 사용하는 경우 `build.gradle.kts` 파일에서 재정의할 수 있습니다.
3. 새 하위 폴더를 선택하고 **File | New | File**을 사용하여 `png.def` 파일을 만듭니다.
4. 필요한 속성을 추가합니다.

   ```none
   headers = png.h
   headerFilter = png.h
   package = png
   
   compilerOpts.linux = -I/usr/include -I/usr/include/x86_64-linux-gnu
   linkerOpts.osx = -L/opt/local/lib -L/usr/local/opt/png/lib -lpng
   linkerOpts.linux = -L/usr/lib/x86_64-linux-gnu -lpng
   ```

   * `headers`는 Kotlin 스텁을 생성할 헤더 파일 목록입니다. 이 항목에 여러 파일을 추가할 수 있으며,
     각 파일은 공백으로 구분합니다. 이 경우, `png.h` 하나뿐입니다. 참조된 파일은 지정된 경로(이 경우 `/usr/include/png`)에서 사용할 수 있어야 합니다.
   * `headerFilter`는 정확히 무엇이 포함되는지 보여줍니다. C에서는 `#include` 지시문을 사용하여 한 파일이
     다른 파일을 참조할 때 모든 헤더도 포함됩니다. 때로는 필요하지 않으며, [glob 패턴 사용](https://en.wikipedia.org/wiki/Glob_(programming))을 사용하여 이 매개변수를 추가하여 조정할 수 있습니다.

     외부 종속성(예: 시스템 `stdint.h` 헤더)을 interop 라이브러리로 가져오고 싶지 않은 경우 `headerFilter`를 사용할 수 있습니다. 또한 라이브러리 크기 최적화와 시스템 및 제공된 Kotlin/Native 컴파일 환경 간의 잠재적 충돌을 해결하는 데 유용할 수 있습니다.

   * 특정 플랫폼에 대한 동작을 수정해야 하는 경우 `compilerOpts.osx` 또는
     `compilerOpts.linux`와 같은 형식을 사용하여 플랫폼별 값을 옵션에 제공할 수 있습니다. 이 경우 macOS
     (`.osx` 접미사) 및 Linux(`.linux` 접미사)입니다. 접미사가 없는 매개변수(예: `linkerOpts=`)도 가능하며
     모든 플랫폼에 적용됩니다.

5. 바인딩을 생성하려면 알림에서 **Sync Now**를 클릭하여 Gradle 파일을 동기화합니다.

   <img src="/img/gradle-sync.png" alt="Synchronize the Gradle files" style={{verticalAlign: 'middle'}}/>

바인딩 생성 후 IDE는 이를 네이티브 라이브러리의 프록시 뷰로 사용할 수 있습니다.

:::note
명령줄에서 [cinterop 도구](#generate-bindings-using-command-line)를 사용하여 바인딩 생성을 구성할 수도 있습니다.

## 속성

생성된 바이너리의 내용을 조정하기 위해 정의 파일에서 사용할 수 있는 전체 속성 목록은 다음과 같습니다.
자세한 내용은 아래 해당 섹션을 참조하십시오.

| **속성**                                                                        | **설명**                                                                                                                                                                                                          |
|-------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`headers`](#import-headers)                                                        | 바인딩에 포함될 라이브러리의 헤더 목록입니다.                                                                                                                                                                       |
| [`modules`](#import-modules)                                                        | 바인딩에 포함될 Objective-C 라이브러리의 Clang 모듈 목록입니다.                                                                                                                                                   |
| `language`                                                                          | 언어를 지정합니다. 기본적으로 C가 사용됩니다. 필요한 경우 `Objective-C`로 변경합니다.                                                                                                                                   |
| [`compilerOpts`](#pass-compiler-and-linker-options)                                 | cinterop 도구가 C 컴파일러에 전달하는 컴파일러 옵션입니다.                                                                                                                                                         |
| [`linkerOpts`](#pass-compiler-and-linker-options)                                   | cinterop 도구가 링커에 전달하는 링커 옵션입니다.                                                                                                                                                               |
| [`excludedFunctions`](#ignore-specific-functions)                                   | 무시해야 하는 함수 이름의 공백으로 구분된 목록입니다.                                                                                                                                                          |                                              
| `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| [`staticLibraries`](#include-a-static-library)                                      | [Experimental](components-stability#stability-levels-explained). 정적 라이브러리를 `.klib`에 포함합니다.                                                                                                             |
| [`libraryPaths`](#include-a-static-library)                                         | [Experimental](components-stability#stability-levels-explained). cinterop 도구가 `.klib`에 포함될 라이브러리를 검색하는 디렉터리의 공백으로 구분된 목록입니다.                                                  |
| `packageName`                                                                       | 생성된 Kotlin API의 패키지 접두사입니다.                                                                                                                                                                          |
| [`headerFilter`](#filter-headers-by-globs)                                          | glob으로 헤더를 필터링하고 라이브러리를 가져올 때만 포함합니다.                                                                                                                                                 |
| [`excludeFilter`](#exclude-headers)                                                 | 라이브러리를 가져올 때 특정 헤더를 제외하고 `headerFilter`보다 우선합니다.                                                                                                                                             |
| [`strictEnums`](#configure-enums-generation)                                        | [Kotlin enums](enum-classes)로 생성해야 하는 enums의 공백으로 구분된 목록입니다.                                                                                                                              |
| [`nonStrictEnums`](#configure-enums-generation)                                     | 정수 값으로 생성해야 하는 enums의 공백으로 구분된 목록입니다.                                                                                                                                                   |
| [`noStringConversion`](#set-up-string-conversion)                                   | `const char*` 매개변수를 Kotlin `String`으로 자동 변환하지 않아야 하는 함수의 공백으로 구분된 목록입니다.                                                                                                   |
| `allowedOverloadsForCFunctions`                                                     | 기본적으로 C 함수는 고유한 이름을 갖는다고 가정합니다. 여러 함수가 동일한 이름을 가진 경우 하나만 선택됩니다. 그러나 `allowedOverloadsForCFunctions`에서 이러한 함수를 지정하여 이를 변경할 수 있습니다. |
| [`disableDesignatedInitializerChecks`](#allow-calling-a-non-designated-initializer) | 지정되지 않은 Objective-C 초기화 프로그램을 `super()` 생성자로 호출하는 것을 허용하지 않는 컴파일러 검사를 비활성화합니다.                                                                                           |
| [`foreignExceptionMode`](#handle-objective-c-exceptions)                            | Objective-C 코드의 예외를 `ForeignException` 유형의 Kotlin 예외로 래핑합니다.                                                                                                                               |
| [`userSetupHint`](#help-resolve-linker-errors)                                      | 예를 들어, 사용자가 링커 오류를 해결하는 데 도움이 되는 사용자 지정 메시지를 추가합니다.                                                                                                                             |

<!-- | `excludedMacros`                                                                    |                                                                                                                                                                                                                          |
| `objcClassesIncludingCategories`                                                    |                                                                                                                                                                                                                          | -->

속성 목록 외에도 정의 파일에 [사용자 지정 선언](#add-custom-declarations)을 포함할 수 있습니다.

### 헤더 가져오기

C 라이브러리에 Clang 모듈이 없고 헤더 집합으로 구성된 경우 `headers` 속성을 사용하여
가져올 헤더를 지정합니다.

```none
headers = curl/curl.h
```

#### glob으로 헤더 필터링

`.def` 파일의 필터 속성을 사용하여 glob으로 헤더를 필터링할 수 있습니다. 헤더에서 선언을 포함하려면
`headerFilter` 속성을 사용합니다. 헤더가 glob과 일치하면 해당 선언이 바인딩에 포함됩니다.

glob은 적절한 include 경로 요소를 기준으로 헤더 경로에 적용됩니다.
예를 들어, `time.h` 또는 `curl/curl.h`입니다. 따라서 일반적으로 `#include <SomeLibrary/Header.h>`로 라이브러리가 포함된 경우,
다음 필터를 사용하여 헤더를 필터링할 수 있습니다.

```none
headerFilter = SomeLibrary/**
```

`headerFilter`가 제공되지 않으면 모든 헤더가 포함됩니다. 그러나 `headerFilter`를 사용하고
glob을 가능한 한 정확하게 지정하는 것이 좋습니다. 이 경우 생성된 라이브러리에는 필요한
선언만 포함됩니다. 이는 개발 환경에서 Kotlin 또는 도구를 업그레이드할 때 다양한 문제를 방지하는 데 도움이 될 수 있습니다.

#### 헤더 제외

특정 헤더를 제외하려면 `excludeFilter` 속성을 사용합니다. 지정된 헤더의 선언이 바인딩에 포함되지 않으므로
중복되거나 문제가 있는 헤더를 제거하고 컴파일을 최적화하는 데 유용할 수 있습니다.

```none
excludeFilter = SomeLibrary/time.h
```

동일한 헤더가 `headerFilter`로 포함되고 `excludeFilter`로 제외된 경우 지정된 헤더는
바인딩에 포함되지 않습니다.

:::

### 모듈 가져오기

Objective-C 라이브러리에 Clang 모듈이 있는 경우 `modules` 속성을 사용하여 가져올 모듈을 지정합니다.

```none
modules = UIKit
```

### 컴파일러 및 링커 옵션 전달

`compilerOpts` 속성을 사용하여 C 컴파일러에 옵션을 전달합니다. C 컴파일러는 내부적으로 헤더를 분석하는 데 사용됩니다.
최종 실행 파일을 연결하는 데 사용되는 링커에 옵션을 전달하려면 `linkerOpts`를 사용합니다. 예:

```none
compilerOpts = -DFOO=bar
linkerOpts = -lpng
```

특정 대상에만 적용되는 대상별 옵션을 지정할 수도 있습니다.

```none
compilerOpts = -DBAR=bar
compilerOpts.linux_x64 = -DFOO=foo1
compilerOpts.macos_x64 = -DFOO=foo2
```

이 구성에서는 Linux에서 `-DBAR=bar -DFOO=foo1`을 사용하고 macOS에서 `-DBAR=bar -DFOO=foo2`를 사용하여 헤더를 분석합니다.
정의 파일 옵션에는 공통 부분과 플랫폼별 부분이 모두 있을 수 있습니다.

### 특정 함수 무시

무시해야 하는 함수 이름 목록을 지정하려면 `excludedFunctions` 속성을 사용합니다. 이는 헤더에 선언된 함수가 호출 가능하다고 보장할 수 없고,
이를 자동으로 확인하기 어렵거나 불가능한 경우에 유용할 수 있습니다. 이 속성을 사용하여 interop 자체의 버그를 해결할 수도 있습니다.

### 정적 라이브러리 포함

:::caution
이 기능은 [Experimental](components-stability#stability-levels-explained)입니다. 언제든지 삭제되거나 변경될 수 있습니다.
평가 목적으로만 사용하십시오.

:::

사용자 환경 내에서 사용할 수 있다고 가정하는 대신 정적 라이브러리를 제품과 함께 제공하는 것이 더 편리한 경우가 있습니다. 정적 라이브러리를 `.klib`에 포함하려면 `staticLibrary` 및 `libraryPaths` 속성을 사용합니다.

```none
headers = foo.h
staticLibraries = libfoo.a
libraryPaths = /opt/local/lib /usr/local/opt/curl/lib
```

위 스니펫이 주어지면 cinterop 도구는 `/opt/local/lib` 및 `/usr/local/opt/curl/lib`에서 `libfoo.a`를 검색하고,
찾은 경우 라이브러리 바이너리를 `klib`에 포함합니다.

프로그램에서 이와 같은 `klib`를 사용하는 경우 라이브러리가 자동으로 연결됩니다.

### enums 생성 구성

Kotlin enums로 enums를 생성하려면 `strictEnums` 속성을 사용하고, 정수 값으로 생성하려면 `nonStrictEnums`를 사용합니다.
이러한 목록에 포함되지 않은 enum은 heuristics를 기반으로 생성됩니다.

### 문자열 변환 설정

`const char*` 함수 매개변수를 Kotlin `String`으로 자동 변환하지 않으려면 `noStringConversion` 속성을 사용합니다.

### 지정되지 않은 초기화 프로그램을 호출하도록 허용

기본적으로 Kotlin/Native 컴파일러는 지정되지 않은 Objective-C 초기화 프로그램을 `super()`
생성자로 호출하는 것을 허용하지 않습니다. 지정된 Objective-C 초기화 프로그램이 라이브러리에서 제대로 표시되지 않으면 이 동작이 불편할 수 있습니다.
이러한 컴파일러 검사를 비활성화하려면 `disableDesignatedInitializerChecks` 속성을 사용합니다.

### Objective-C 예외 처리

기본적으로 Objective-C 예외가 Objective-C에서 Kotlin interop 경계에 도달하여
Kotlin 코드에 도달하면 프로그램이 충돌합니다.

Objective-C 예외를 Kotlin으로 전파하려면 `foreignExceptionMode = objc-wrap` 속성을 사용하여 래핑을 활성화합니다.
이 경우 Objective-C 예외는 `ForeignException` 유형을 가져오는 Kotlin 예외로 변환됩니다.

#### 링커 오류 해결 지원

예를 들어, Kotlin 라이브러리가 [CocoaPods 통합](native-cocoapods)을 사용하여 C 또는 Objective-C 라이브러리에 종속된 경우 링커 오류가 발생할 수 있습니다.
종속 라이브러리가 로컬 시스템에 설치되어 있지 않거나 프로젝트 빌드 스크립트에 명시적으로 구성되어 있지 않으면 "Framework not found" 오류가 발생합니다.

라이브러리 작성자인 경우 사용자 지정 메시지를 사용하여 사용자가 링커 오류를 해결하는 데 도움을 줄 수 있습니다.
이를 위해 `.def` 파일에 `userSetupHint=message` 속성을 추가하거나 `-Xuser-setup-hint` 컴파일러 옵션을
`cinterop`에 전달합니다.

### 사용자 지정 선언 추가

바인딩을 생성하기 전에 라이브러리에 사용자 지정 C 선언을 추가해야 하는 경우가 있습니다([예: macros](native-c-interop#macros)).
이러한 선언이 있는 추가 헤더 파일을 만드는 대신 분리선(분리 시퀀스 `---`만 포함)을 포함하는 줄 뒤에 `.def` 파일 끝에 직접 포함할 수 있습니다.

```none
headers = errno.h
---

static inline int getErrno() {
    return errno;
}
```

`.def` 파일의 이 부분은 헤더 파일의 일부로 처리되므로 본문이 있는 함수는 `static`으로
선언해야 합니다. 선언은 `headers` 목록의 파일을 포함한 후 구문 분석됩니다.

## 명령줄을 사용하여 바인딩 생성

정의 파일 외에도 `cinterop` 호출에서 해당 속성을 옵션으로 전달하여 바인딩에 포함할 내용을 지정할 수 있습니다.

다음은 컴파일된 `png.klib` 라이브러리를 생성하는 명령의 예입니다.

```bash
cinterop -def png.def -compiler-option -I/usr/local/include -o png
```

생성된 바인딩은 일반적으로 플랫폼별이므로 여러 대상을 대상으로 개발하는 경우
바인딩을 다시 생성해야 합니다.

* sysroot 검색 경로에 포함되지 않은 호스트 라이브러리의 경우 헤더가 필요할 수 있습니다.
* 구성 스크립트가 있는 일반적인 UNIX 라이브러리의 경우 `compilerOpts`에는 `--cflags` 옵션(정확한 경로 없이)이 있는 구성 스크립트의 출력이 포함될 가능성이 높습니다.
* `--libs`가 있는 구성 스크립트의 출력은 `linkerOpts` 속성에 전달될 수 있습니다.

## 다음 단계

* [C-interoperability를 위한 바인딩](native-c-interop#bindings)
* [Swift/Objective-C와의 상호 운용성](native-objc-interop)
  ```