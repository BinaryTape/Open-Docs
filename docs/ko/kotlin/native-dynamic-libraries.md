---
title: "Kotlin/Native를 동적 라이브러리로 사용하기 – 튜토리얼"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

기존 프로그램에서 Kotlin 코드를 사용하기 위해 다이내믹 라이브러리를 만들 수 있습니다. 이를 통해 JVM, Python, Android 등을 포함한 많은 플랫폼 또는 언어에서 코드 공유가 가능합니다.

:::note
iOS 및 기타 Apple 타겟의 경우 프레임워크 생성을 권장합니다. [Kotlin/Native를 Apple 프레임워크로 사용하기](apple-framework) 튜토리얼을 참조하세요.

기존 네이티브 애플리케이션 또는 라이브러리에서 Kotlin/Native 코드를 사용할 수 있습니다. 이를 위해서는 Kotlin 코드를 `.so`, `.dylib` 또는 `.dll` 형식의 다이내믹 라이브러리로 컴파일해야 합니다.

이 튜토리얼에서는 다음을 수행합니다.

* [Kotlin 코드를 다이내믹 라이브러리로 컴파일](#create-a-kotlin-library)
* [생성된 C 헤더 검토](#generated-header-file)
* [C에서 Kotlin 다이내믹 라이브러리 사용](#use-generated-headers-from-c)
* [프로젝트 컴파일 및 실행](#compile-and-run-the-project)

명령줄을 사용하여 Kotlin 라이브러리를 직접 또는 스크립트 파일(`.sh` 또는 `.bat` 파일 등)과 함께 생성할 수 있습니다.
그러나 이 방법은 수백 개의 파일과 라이브러리가 있는 대규모 프로젝트에는 적합하지 않습니다.
빌드 시스템을 사용하면 Kotlin/Native 컴파일러 바이너리 및 전이적 종속성이 있는 라이브러리를 다운로드하고 캐싱하고, 컴파일러 및 테스트를 실행하여 프로세스를 간소화할 수 있습니다.
Kotlin/Native는 [Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms)을 통해 [Gradle](https://gradle.org) 빌드 시스템을 사용할 수 있습니다.

Kotlin/Native의 고급 C interop 관련 사용법과 Gradle을 사용한 [Kotlin Multiplatform](gradle-configure-project#targeting-multiple-platforms) 빌드를 살펴보겠습니다.

Mac을 사용하고 macOS 또는 기타 Apple 타겟용 애플리케이션을 만들고 실행하려면 먼저 [Xcode Command Line Tools](https://developer.apple.com/download/)를 설치하고 실행하여 라이선스 약관에 동의해야 합니다.

:::

## Kotlin 라이브러리 만들기

Kotlin/Native 컴파일러는 Kotlin 코드에서 다이내믹 라이브러리를 생성할 수 있습니다. 다이내믹 라이브러리에는 일반적으로 `.h` 헤더 파일이 함께 제공되며, 이를 사용하여 C에서 컴파일된 코드를 호출합니다.

Kotlin 라이브러리를 만들고 C 프로그램에서 사용해 보겠습니다.

:::note
자세한 첫 단계는 [Kotlin/Native 시작하기](native-get-started#using-gradle) 튜토리얼을 참조하세요.
새 Kotlin/Native 프로젝트를 만들고 IntelliJ IDEA에서 여는 방법에 대한 지침도 있습니다.

1. `src/nativeMain/kotlin` 디렉터리로 이동하여 다음 라이브러리 내용으로 `lib.kt` 파일을 만듭니다.

   ```kotlin
   package example
    
   object Object { 
       val field = "A"
   }
    
   class Clazz {
       fun memberFunction(p: Int): ULong = 42UL
   }
    
   fun forIntegers(b: Byte, s: Short, i: UInt, l: Long) { }
   fun forFloats(f: Float, d: Double) { }
    
   fun strings(str: String) : String? {
       return "That is '$str' from C"
   }
    
   val globalString = "A global String"
   ```

2. `build.gradle(.kts)` Gradle 빌드 파일을 다음과 같이 업데이트합니다.

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    plugins {
        kotlin("multiplatform") version "2.1.20"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon의 macOS
        // macosX64("native") {   // x86_64 플랫폼의 macOS
        // linuxArm64("native") { // ARM64 플랫폼의 Linux
        // linuxX64("native") {   // x86_64 플랫폼의 Linux
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS 및 Linux 
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "8.10"
        distributionType = Wrapper.DistributionType.ALL
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // x86_64 플랫폼의 macOS
        // linuxArm64("native") { // ARM64 플랫폼의 Linux
        // linuxX64("native") {   // x86_64 플랫폼의 Linux
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS 및 Linux 
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    wrapper {
        gradleVersion = "8.10"
        distributionType = "ALL"
    }
    ```

    </TabItem>
    </Tabs>

    * `binaries {}` 블록은 다이내믹 또는 공유 라이브러리를 생성하도록 프로젝트를 구성합니다.
    * `libnative`는 라이브러리 이름, 생성된 헤더 파일 이름의 접두사로 사용됩니다. 또한 헤더 파일의 모든 선언에 접두사를 붙입니다.

3. IDE에서 `linkDebugSharedNative` Gradle 작업을 실행하거나 터미널에서 다음 콘솔 명령을 사용하여 라이브러리를 빌드합니다.

   ```bash
   ./gradlew linkDebugSharedNative
   ```

빌드는 다음 파일과 함께 `build/bin/native/debugShared` 디렉터리에 라이브러리를 생성합니다.

* macOS `libnative_api.h` 및 `libnative.dylib`
* Linux: `libnative_api.h` 및 `libnative.so`
* Windows: `libnative_api.h`, `libnative.def` 및 `libnative.dll`

`linkNative` Gradle 작업을 사용하여 라이브러리의 `debug` 및 `release` 변형을 모두 생성할 수도 있습니다.

Kotlin/Native 컴파일러는 모든 플랫폼에 대해 `.h` 파일을 생성하는 데 동일한 규칙을 사용합니다. Kotlin 라이브러리의 C API를 확인해 보겠습니다.

## 생성된 헤더 파일

Kotlin/Native 선언이 C 함수에 어떻게 매핑되는지 살펴보겠습니다.

`build/bin/native/debugShared` 디렉터리에서 `libnative_api.h` 헤더 파일을 엽니다.
가장 첫 번째 부분에는 표준 C/C++ 헤더와 푸터가 포함되어 있습니다.

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// The rest of the generated code

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

다음으로 `libnative_api.h`에는 일반적인 유형 정의 블록이 포함되어 있습니다.

```c
#ifdef __cplusplus
typedef bool            libnative_KBoolean;
#else
typedef _Bool           libnative_KBoolean;
#endif
typedef unsigned short     libnative_KChar;
typedef signed char        libnative_KByte;
typedef short              libnative_KShort;
typedef int                libnative_KInt;
typedef long long          libnative_KLong;
typedef unsigned char      libnative_KUByte;
typedef unsigned short     libnative_KUShort;
typedef unsigned int       libnative_KUInt;
typedef unsigned long long libnative_KULong;
typedef float              libnative_KFloat;
typedef double             libnative_KDouble;
typedef float __attribute__ ((__vector_size__ (16))) libnative_KVector128;
typedef void*              libnative_KNativePtr;
``` 

Kotlin은 생성된 `libnative_api.h` 파일의 모든 선언에 `libnative_` 접두사를 사용합니다. 다음은 유형 매핑의 전체 목록입니다.

| Kotlin 정의      | C 유형                                        |
|------------------------|-----------------------------------------------|
| `libnative_KBoolean`   | `bool` 또는 `_Bool`                             |
| `libnative_KChar`      | `unsigned short`                              |
| `libnative_KByte`      | `signed char`                                 |
| `libnative_KShort`     | `short`                                       |
| `libnative_KInt`       | `int`                                         |
| `libnative_KLong`      | `long long`                                   |
| `libnative_KUByte`     | `unsigned char`                               |
| `libnative_KUShort`    | `unsigned short`                              |
| `libnative_KUInt`      | `unsigned int`                                |
| `libnative_KULong`     | `unsigned long long`                          |
| `libnative_KFloat`     | `float`                                       |
| `libnative_KDouble`    | `double`                                      |
| `libnative_KVector128` | `float __attribute__ ((__vector_size__ (16))` |
| `libnative_KNativePtr` | `void*`                                       |

`libnative_api.h` 파일의 정의 섹션에서는 Kotlin 기본 유형이 C 기본 유형에 매핑되는 방식을 보여줍니다.
Kotlin/Native 컴파일러는 모든 라이브러리에 대해 이러한 항목을 자동으로 생성합니다.
역방향 매핑은 [C에서 기본 데이터 유형 매핑](mapping-primitive-data-types-from-c) 튜토리얼에 설명되어 있습니다.

자동으로 생성된 유형 정의 후에는 라이브러리에서 사용되는 별도의 유형 정의를 찾을 수 있습니다.

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// Automatically generated type definitions

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

C에서 `typedef struct { ... } TYPE_NAME` 구문은 구조체를 선언합니다.

이 패턴에 대한 자세한 설명은 [이 StackOverflow 스레드](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)를 참조하세요.

이러한 정의에서 볼 수 있듯이 Kotlin 유형은 동일한 패턴을 사용하여 매핑됩니다. `Object`는
`libnative_kref_example_Object`에 매핑되고 `Clazz`는 `libnative_kref_example_Clazz`에 매핑됩니다. 모든 구조체에는 포인터가 있는 `pinned` 필드만 포함됩니다. 필드 유형 `libnative_KNativePtr`은 파일 앞부분에서 `void*`로 정의됩니다.

C는 네임스페이스를 지원하지 않으므로 Kotlin/Native 컴파일러는 기존 네이티브 프로젝트의 다른 기호와의 충돌을 방지하기 위해 긴 이름을 생성합니다.

### 서비스 런타임 함수

`libnative_ExportedSymbols` 구조체는 Kotlin/Native 및 라이브러리에서 제공하는 모든 함수를 정의합니다.
패키지를 모방하기 위해 중첩된 익명 구조체를 많이 사용합니다. `libnative_` 접두사는 라이브러리 이름에서 가져옵니다.

`libnative_ExportedSymbols`에는 헤더 파일에 여러 도우미 함수가 포함되어 있습니다.

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

이러한 함수는 Kotlin/Native 객체를 처리합니다. `DisposeStablePointer`는 Kotlin 객체에 대한 참조를 해제하기 위해 호출되고, `DisposeString`은 C에서 `char*` 유형인 Kotlin 문자열을 해제하기 위해 호출됩니다.

`libnative_api.h` 파일의 다음 부분은 런타임 함수의 구조체 선언으로 구성됩니다.

```c
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
libnative_KBoolean (*IsInstance)(libnative_KNativePtr ref, const libnative_KType* type);
libnative_kref_kotlin_Byte (*createNullableByte)(libnative_KByte);
libnative_KByte (*getNonNullValueOfByte)(libnative_kref_kotlin_Byte);
libnative_kref_kotlin_Short (*createNullableShort)(libnative_KShort);
libnative_KShort (*getNonNullValueOfShort)(libnative_kref_kotlin_Short);
libnative_kref_kotlin_Int (*createNullableInt)(libnative_KInt);
libnative_KInt (*getNonNullValueOfInt)(libnative_kref_kotlin_Int);
libnative_kref_kotlin_Long (*createNullableLong)(libnative_KLong);
libnative_KLong (*getNonNullValueOfLong)(libnative_kref_kotlin_Long);
libnative_kref_kotlin_Float (*createNullableFloat)(libnative_KFloat);
libnative_KFloat (*getNonNullValueOfFloat)(libnative_kref_kotlin_Float);
libnative_kref_kotlin_Double (*createNullableDouble)(libnative_KDouble);
libnative_KDouble (*getNonNullValueOfDouble)(libnative_kref_kotlin_Double);
libnative_kref_kotlin_Char (*createNullableChar)(libnative_KChar);
libnative_KChar (*getNonNullValueOfChar)(libnative_kref_kotlin_Char);
libnative_kref_kotlin_Boolean (*createNullableBoolean)(libnative_KBoolean);
libnative_KBoolean (*getNonNullValueOfBoolean)(libnative_kref_kotlin_Boolean);
libnative_kref_kotlin_Unit (*createNullableUnit)(void);
libnative_kref_kotlin_UByte (*createNullableUByte)(libnative_KUByte);
libnative_KUByte (*getNonNullValueOfUByte)(libnative_kref_kotlin_UByte);
libnative_kref_kotlin_UShort (*createNullableUShort)(libnative_KUShort);
libnative_KUShort (*getNonNullValueOfUShort)(libnative_kref_kotlin_UShort);
libnative_kref_kotlin_UInt (*createNullableUInt)(libnative_KUInt);
libnative_KUInt (*getNonNullValueOfUInt)(libnative_kref_kotlin_UInt);
libnative_kref_kotlin_ULong (*createNullableULong)(libnative_KULong);
libnative_KULong (*getNonNullValueOfULong)(libnative_kref_kotlin_ULong);
```

`.pinned` 포인터로 참조되는 Kotlin 객체가 유형의 인스턴스인지 확인하기 위해 `IsInstance` 함수를 사용할 수 있습니다. 생성되는 실제 작업 집합은 실제 사용량에 따라 다릅니다.

Kotlin/Native에는 자체 가비지 수집기가 있지만 C에서 액세스하는 Kotlin 객체는 관리하지 않습니다. 그러나
Kotlin/Native는 [Swift/Objective-C와의 상호 운용성](native-objc-interop)을 제공하며,
가비지 수집기는 [Swift/Objective-C ARC와 통합](native-arc-integration)되어 있습니다.

### 라이브러리 함수

라이브러리에서 사용되는 별도의 구조체 선언을 살펴보겠습니다. `libnative_kref_example` 필드는
`libnative_kref.` 접두사가 있는 Kotlin 코드의 패키지 구조를 모방합니다.

```c
typedef struct {
  /* User functions. */
  struct {
    struct {
      struct {
        struct {
          libnative_KType* (*_type)(void);
          libnative_kref_example_Object (*_instance)();
          const char* (*get_field)(libnative_kref_example_Object thiz);
        } Object;
        struct {
          libnative_KType* (*_type)(void);
          libnative_kref_example_Clazz (*Clazz)();
          libnative_KULong (*memberFunction)(libnative_kref_example_Clazz thiz, libnative_KInt p);
        } Clazz;
        const char* (*get_globalString)();
        void (*forFloats)(libnative_KFloat f, libnative_KDouble d);
        void (*forIntegers)(libnative_KByte b, libnative_KShort s, libnative_KUInt i, libnative_KLong l);
        const char* (*strings)(const char* str);
      } example;
    } root;
  } kotlin;
} libnative_ExportedSymbols;
```

코드는 익명 구조체 선언을 사용합니다. 여기서 `struct { ... } foo`는 이름이 없는 익명 구조체 유형의 외부 구조체에 필드를 선언합니다.

C는 객체를 지원하지 않으므로 함수 포인터를 사용하여 객체 의미 체계를 모방합니다. 함수 포인터는
`RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`로 선언됩니다.

`libnative_kref_example_Clazz` 필드는 Kotlin의 `Clazz`를 나타냅니다. `libnative_KULong`은
`memberFunction` 필드를 통해 액세스할 수 있습니다. 유일한 차이점은 `memberFunction`가 `thiz` 참조를
첫 번째 매개변수로 받는다는 것입니다. C는 객체를 지원하지 않으므로 `thiz` 포인터가 명시적으로 전달됩니다.

`Clazz` 필드(aka `libnative_kref_example_Clazz_Clazz`)에는 생성자가 있으며, 이는 `Clazz`의 인스턴스를 만드는 생성자 함수 역할을 합니다.

Kotlin `object Object`는 `libnative_kref_example_Object`로 액세스할 수 있습니다. `_instance` 함수는 객체의 유일한 인스턴스를 검색합니다.

속성은 함수로 변환됩니다. `get_` 및 `set_` 접두사는 각각 getter 및 setter 함수의 이름을 지정합니다. 예를 들어 Kotlin의 읽기 전용 속성 `globalString`은 C에서 `get_globalString` 함수로 바뀝니다.

전역 함수 `forFloats`, `forIntegers` 및 `strings`는 `libnative_kref_example` 익명 구조체의 함수 포인터로 바뀝니다.

### 진입점

이제 API가 생성되는 방법을 알았으므로 `libnative_ExportedSymbols` 구조체의 초기화가 시작점입니다.
이제 `libnative_api.h`의 마지막 부분을 살펴보겠습니다.

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 함수를 사용하면 네이티브 코드에서 Kotlin/Native 라이브러리로의 게이트웨이를 열 수 있습니다.
이것은 라이브러리에 액세스하기 위한 진입점입니다. 라이브러리 이름은 함수 이름의 접두사로 사용됩니다.

반환된 `libnative_ExportedSymbols*` 포인터를 스레드당 호스팅해야 할 수 있습니다.

:::

## C에서 생성된 헤더 사용

C에서 생성된 헤더를 사용하는 것은 간단합니다. 라이브러리 디렉터리에서 다음 코드를 사용하여 `main.c` 파일을 만듭니다.

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // Obtain reference for calling Kotlin/Native functions
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  // Use C and Kotlin/Native strings
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s
out:%s
", str, response);
  lib->DisposeString(response);

  // Create Kotlin object instance
  libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
  long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld
", x);

  return 0;
}
```

## 프로젝트 컴파일 및 실행

### macOS에서

C 코드를 컴파일하고 다이내믹 라이브러리와 연결하려면 라이브러리 디렉터리로 이동하여 다음 명령을 실행합니다.

```bash
clang main.c libnative.dylib
```

컴파일러는 `a.out`이라는 실행 파일을 생성합니다. 실행하여 C 라이브러리에서 Kotlin 코드를 실행합니다.

### Linux에서

C 코드를 컴파일하고 다이내믹 라이브러리와 연결하려면 라이브러리 디렉터리로 이동하여 다음 명령을 실행합니다.

```bash
gcc main.c libnative.so
```

컴파일러는 `a.out`이라는 실행 파일을 생성합니다. 실행하여 C 라이브러리에서 Kotlin 코드를 실행합니다. Linux에서는
애플리케이션이 현재 폴더에서 `libnative.so` 라이브러리를 로드하도록 하려면 `.`을 `LD_LIBRARY_PATH`에 포함해야 합니다.

### Windows에서

먼저 x64_64 타겟을 지원하는 Microsoft Visual C++ 컴파일러를 설치해야 합니다.

가장 쉬운 방법은 Windows 시스템에 Microsoft Visual Studio를 설치하는 것입니다. 설치하는 동안
C++로 작업하는 데 필요한 구성 요소를 선택합니다(예: **C++를 사용한 데스크톱 개발**).

Windows에서는 정적 라이브러리 래퍼를 생성하거나 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)
또는 유사한 Win32API 함수를 사용하여 동적 라이브러리를 포함할 수 있습니다.

첫 번째 옵션을 사용하여 `libnative.dll`에 대한 정적 래퍼 라이브러리를 생성해 보겠습니다.

1. 도구 체인에서 `lib.exe`를 호출하여 DLL 사용을 자동화하는 정적 라이브러리 래퍼 `libnative.lib`를 코드에서 생성합니다.

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. `main.c`를 실행 파일로 컴파일합니다. 생성된 `libnative.lib`를 빌드 명령에 포함하고 시작합니다.

   ```bash
   cl.exe main.c libnative.lib
   ```

   이 명령은 실행할 수 있는 `main.exe` 파일을 생성합니다.

## 다음 단계

* [Swift/Objective-C와의 상호 운용성에 대해 자세히 알아보기](native-objc-interop)
* [Kotlin/Native를 Apple 프레임워크로 사용하기 튜토리얼 확인하기](apple-framework)