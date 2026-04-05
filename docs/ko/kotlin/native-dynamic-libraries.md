[//]: # (title: 동적 라이브러리로서의 Kotlin/Native – 튜토리얼)

기존 프로그램에서 Kotlin 코드를 사용하기 위해 동적 라이브러리(dynamic library)를 생성할 수 있습니다. 이를 통해 JVM, Python, Android 등을 포함한 다양한 플랫폼이나 언어 간에 코드를 공유할 수 있습니다.

> iOS 및 기타 Apple 타겟의 경우, 프레임워크(framework) 생성을 권장합니다. [Apple 프레임워크로서의 Kotlin/Native](apple-framework.md) 튜토리얼을 참고하세요.
> 
{style="tip"}

기존 네이티브 애플리케이션이나 라이브러리에서 Kotlin/Native 코드를 사용할 수 있습니다. 이를 위해서는 Kotlin 코드를 `.so`, `.dylib` 또는 `.dll` 형식의 동적 라이브러리로 컴파일해야 합니다.

이 튜토리얼에서는 다음 내용을 다룹니다:

* [Kotlin 코드를 동적 라이브러리로 컴파일하기](#create-a-kotlin-library)
* [생성된 C 헤더 검토하기](#generated-header-file)
* [C에서 Kotlin 동적 라이브러리 사용하기](#use-generated-headers-from-c)
* [프로젝트 컴파일 및 실행하기](#compile-and-run-the-project)

직접 또는 스크립트 파일(`.sh` 또는 `.bat` 파일)을 사용하여 커맨드 라인에서 Kotlin 라이브러리를 생성할 수 있습니다. 그러나 이 방식은 수백 개의 파일과 라이브러리가 있는 대규모 프로젝트에는 적합하지 않습니다. 빌드 시스템을 사용하면 Kotlin/Native 컴파일러 바이너리와 전역 의존성이 있는 라이브러리를 다운로드 및 캐싱하고, 컴파일러와 테스트를 실행하는 과정을 단순화할 수 있습니다. Kotlin/Native는 [Kotlin 멀티플랫폼 플러그인](gradle-configure-project.md#targeting-multiple-platforms)을 통해 [Gradle](https://gradle.org) 빌드 시스템을 사용할 수 있습니다.

Gradle을 사용한 Kotlin/Native 및 [Kotlin 멀티플랫폼](gradle-configure-project.md#targeting-multiple-platforms) 빌드의 고급 C 상호 운용성(interop) 관련 사용법을 살펴보겠습니다.

> Mac을 사용 중이고 macOS 또는 기타 Apple 타겟용 애플리케이션을 만들고 실행하려면, 먼저 [Xcode Command Line Tools](https://developer.apple.com/download/)를 설치하고 실행하여 라이선스 약관에 동의해야 합니다.
>
{style="note"}

## Kotlin 라이브러리 생성하기

Kotlin/Native 컴파일러는 Kotlin 코드에서 동적 라이브러리를 생성할 수 있습니다. 동적 라이브러리는 대개 C에서 컴파일된 코드를 호출하는 데 사용하는 `.h` 헤더 파일과 함께 제공됩니다.

Kotlin 라이브러리를 생성하고 C 프로그램에서 사용해 보겠습니다.

> 새로운 Kotlin/Native 프로젝트를 생성하고 IntelliJ IDEA에서 여는 방법에 대한 자세한 단계와 지침은 [Kotlin/Native 시작하기](native-get-started.md#using-gradle) 튜토리얼을 참고하세요.
>
{style="tip"}

1. `src/nativeMain/kotlin` 디렉터리로 이동하여 다음 라이브러리 내용을 포함하는 `lib.kt` 파일을 생성합니다.

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

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget
   
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64()    // Apple Silicon 기반 macOS
        // linuxArm64() // ARM64 플랫폼 기반 Linux
        // linuxX64()   // x86_64 플랫폼 기반 Linux
        // mingwX64()   // Windows

        targets.withType<KotlinNativeTarget>().configureEach {
            binaries {
                sharedLib {
                    baseName = "native"       // macOS
                    // baseName = "native"    // Linux
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.ALL
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    import org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget
    
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64()    // Apple Silicon 기반 macOS
        // linuxArm64() // ARM64 플랫폼 기반 Linux
        // linuxX64()   // x86_64 플랫폼 기반 Linux
        // mingwX64()   // Windows

        targets.withType(KotlinNativeTarget).configureEach {
            binaries {
                sharedLib {
                    baseName = "native"       // macOS
                    // baseName = "native"    // Linux
                    // baseName = "libnative" // Windows
                }
            }
        }
    }
    
    wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = "ALL"
    }
    ```

    </tab>
    </tabs>

    * `binaries {}` 블록은 프로젝트가 동적 또는 공유 라이브러리를 생성하도록 구성합니다.
    * `libnative`는 라이브러리 이름으로 사용되며, 생성된 헤더 파일 이름의 접두사가 됩니다. 또한 헤더 파일의 모든 선언에도 이 접두사가 붙습니다.

3. 라이브러리를 빌드하려면 IDE에서 `linkDebugShared<YourTargetName>` Gradle 태스크를 실행하거나, 이 예제와 같이 터미널에서 콘솔 명령을 사용하세요.

   ```bash
   ./gradlew linkDebugSharedMacosArm64
   ```

빌드 결과 라이브러리는 `build/bin/<yourTargetName>/debugShared` 디렉터리에 다음 파일들과 함께 생성됩니다.

* macOS: `libnative_api.h` 및 `libnative.dylib`
* Linux: `libnative_api.h` 및 `libnative.so`
* Windows: `libnative_api.h`, `libnative.def`, 및 `libnative.dll`

> `linkNative` Gradle 태스크를 사용하면 라이브러리의 `debug`와 `release` 변리언트를 모두 생성할 수 있습니다. 
> 
{style="tip"}

Kotlin/Native 컴파일러는 모든 플랫폼에 대해 동일한 규칙을 사용하여 `.h` 파일을 생성합니다. Kotlin 라이브러리의 C API를 살펴보겠습니다.

## 생성된 헤더 파일

Kotlin/Native 선언이 C 함수에 어떻게 매핑되는지 살펴보겠습니다.

`build/bin/<yourTargetName>/debugShared` 디렉터리에서 `libnative_api.h` 헤더 파일을 엽니다.
가장 먼저 표준 C/C++ 헤더와 푸터(footer)가 나타납니다.

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// 나머지 생성된 코드

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

그다음으로 `libnative_api.h`에는 공통 타입 정의가 포함된 블록이 이어집니다.

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

Kotlin은 생성된 `libnative_api.h` 파일의 모든 선언에 `libnative_` 접두사를 사용합니다. 다음은 타입 매핑의 전체 목록입니다.

| Kotlin 정의             | C 타입                                          |
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

`libnative_api.h` 파일의 정의 섹션은 Kotlin 기본 타입(primitive types)이 C 기본 타입에 어떻게 매핑되는지 보여줍니다. Kotlin/Native 컴파일러는 모든 라이브러리에 대해 이러한 항목을 자동으로 생성합니다. 역방향 매핑은 [C에서 기본 데이터 타입 매핑하기](mapping-primitive-data-types-from-c.md) 튜토리얼에 설명되어 있습니다.

자동 생성된 타입 정의 다음에는 라이브러리에서 사용되는 개별 타입 정의를 찾을 수 있습니다.

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// 자동 생성된 타입 정의

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

C에서 `typedef struct { ... } TYPE_NAME` 구문은 구조체를 선언합니다.

> 이 패턴에 대한 자세한 설명은 [이 StackOverflow 스레드](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)를 참고하세요.
>
{style="tip"}

이 정의들에서 볼 수 있듯이, Kotlin 타입은 동일한 패턴을 사용하여 매핑됩니다. `Object`는 `libnative_kref_example_Object`로, `Clazz`는 `libnative_kref_example_Clazz`로 매핑됩니다. 모든 구조체는 포인터를 가진 `pinned` 필드만 포함합니다. 필드 타입 `libnative_KNativePtr`은 파일 앞부분에서 `void*`로 정의되었습니다.

C는 네임스페이스를 지원하지 않으므로, Kotlin/Native 컴파일러는 기존 네이티브 프로젝트의 다른 심볼과 충돌할 가능성을 피하기 위해 긴 이름을 생성합니다.

### 서비스 런타임 함수

`libnative_ExportedSymbols` 구조체는 Kotlin/Native와 해당 라이브러리에서 제공하는 모든 함수를 정의합니다. 패키지를 모방하기 위해 중첩된 익명 구조체를 많이 사용합니다. `libnative_` 접두사는 라이브러리 이름에서 유래되었습니다.

`libnative_ExportedSymbols`에는 헤더 파일에 몇 가지 헬퍼 함수가 포함되어 있습니다.

```c
typedef struct {
  /* 서비스 함수. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

이 함수들은 Kotlin/Native 객체를 다룹니다. `DisposeStablePointer`는 Kotlin 객체에 대한 참조를 해제하기 위해 호출되고, `DisposeString`은 C에서 `char*` 타입을 가진 Kotlin 문자열을 해제하기 위해 호출됩니다.

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

`IsInstance` 함수를 사용하여 Kotlin 객체(`.pinned` 포인터로 참조됨)가 특정 타입의 인스턴스인지 확인할 수 있습니다. 생성되는 실제 작업 세트는 실제 사용 사례에 따라 달라집니다.

> Kotlin/Native에는 자체 가비지 컬렉터가 있지만, C에서 액세스하는 Kotlin 객체는 관리하지 않습니다. 그러나 Kotlin/Native는 [Swift/Objective-C와의 상호 운용성](native-objc-interop.md)을 제공하며, 가비지 컬렉터는 [Swift/Objective-C ARC와 통합](native-arc-integration.md)되어 있습니다.
>
{style="tip"}

### 라이브러리 함수

라이브러리에서 사용되는 개별 구조체 선언을 살펴보겠습니다. `libnative_kref_example` 필드는 `libnative_kref.` 접두사를 사용하여 Kotlin 코드의 패키지 구조를 모방합니다.

```c
typedef struct {
  /* 사용자 함수. */
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

이 코드는 익명 구조체 선언을 사용합니다. 여기서 `struct { ... } foo`는 이름이 없는 익명 구조체 타입의 필드를 외부 구조체에 선언합니다.

C는 객체를 지원하지 않기 때문에 함수 포인터를 사용하여 객체 시맨틱을 모방합니다. 함수 포인터는 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)` 형식으로 선언됩니다.

`libnative_kref_example_Clazz` 필드는 Kotlin의 `Clazz`를 나타냅니다. `libnative_KULong`은 `memberFunction` 필드를 통해 액세스할 수 있습니다. 유일한 차이점은 `memberFunction`이 첫 번째 매개변수로 `thiz` 참조를 받는다는 것입니다. C는 객체를 지원하지 않으므로 `thiz` 포인터가 명시적으로 전달됩니다.

`Clazz` 필드에는 `Clazz` 인스턴스를 생성하는 생성자 함수 역할을 하는 생성자(즉, `libnative_kref_example_Clazz_Clazz`)가 있습니다.

Kotlin의 `object Object`는 `libnative_kref_example_Object`로 액세스할 수 있습니다. `_instance` 함수는 해당 객체의 유일한 인스턴스를 가져옵니다.

프로퍼티는 함수로 변환됩니다. `get_` 및 `set_` 접두사는 각각 게터(getter)와 세터(setter) 함수의 이름이 됩니다. 예를 들어, Kotlin의 읽기 전용 프로퍼티인 `globalString`은 C에서 `get_globalString` 함수로 변환됩니다.

전역 함수인 `forFloats`, `forIntegers`, `strings`는 `libnative_kref_example` 익명 구조체 내의 함수 포인터로 변환됩니다.

### 진입점 (Entry point)

이제 API가 어떻게 생성되는지 알았으므로, `libnative_ExportedSymbols` 구조체의 초기화가 시작점이 됩니다. 이제 `libnative_api.h`의 마지막 부분을 살펴보겠습니다.

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 함수를 사용하면 네이티브 코드에서 Kotlin/Native 라이브러리로 가는 게이트웨이를 열 수 있습니다. 이것이 라이브러리에 액세스하기 위한 진입점입니다. 라이브러리 이름이 함수 이름의 접두사로 사용됩니다.

> 반환된 `libnative_ExportedSymbols*` 포인터는 스레드별로 호스팅해야 할 수도 있습니다.
>
{style="note"}

## C에서 생성된 헤더 사용하기

C에서 생성된 헤더를 사용하는 방법은 간단합니다. 라이브러리 디렉터리에 다음 코드를 포함하는 `main.c` 파일을 생성합니다.

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // Kotlin/Native 함수 호출을 위한 참조 획득
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  // C 및 Kotlin/Native 문자열 사용
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s
out:%s
", str, response);
  lib->DisposeString(response);

  // Kotlin 객체 인스턴스 생성
  libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
  long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld
", x);

  return 0;
}
```

## 프로젝트 컴파일 및 실행하기

### macOS에서

C 코드를 컴파일하고 동적 라이브러리와 링크하려면, 라이브러리 디렉터리에서 다음 명령을 실행합니다.

```bash
clang main.c libnative.dylib
```

컴파일러는 `a.out`이라는 실행 파일을 생성합니다. 이를 실행하여 C 라이브러리에서 Kotlin 코드를 실행합니다.

### Linux에서

C 코드를 컴파일하고 동적 라이브러리와 링크하려면, 라이브러리 디렉터리에서 다음 명령을 실행합니다.

```bash
gcc main.c libnative.so
```

컴파일러는 `a.out`이라는 실행 파일을 생성합니다. 이를 실행하여 C 라이브러리에서 Kotlin 코드를 실행합니다. Linux에서는 애플리케이션이 현재 폴더에서 `libnative.so` 라이브러리를 로드하도록 하려면 `LD_LIBRARY_PATH`에 `.`을 포함해야 합니다.

### Windows에서

먼저 x64_64 타겟을 지원하는 Microsoft Visual C++ 컴파일러를 설치해야 합니다.

가장 쉬운 방법은 Windows 머신에 Microsoft Visual Studio를 설치하는 것입니다. 설치 중에 **C++를 사용한 데스크톱 개발**과 같이 C++ 작업에 필요한 구성 요소를 선택합니다.

Windows에서는 정적 라이브러리 래퍼를 생성하거나 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) 또는 유사한 Win32API 함수를 사용하여 수동으로 동적 라이브러리를 포함할 수 있습니다.

첫 번째 옵션을 사용하여 `libnative.dll`에 대한 정적 래퍼 라이브러리를 생성해 보겠습니다.

1. 툴체인에서 `lib.exe`를 호출하여 코드에서 DLL 사용을 자동화하는 정적 라이브러리 래퍼 `libnative.lib`를 생성합니다.

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. `main.c`를 실행 파일로 컴파일합니다. 생성된 `libnative.lib`를 빌드 명령에 포함하고 시작합니다.

   ```bash
   cl.exe main.c libnative.lib
   ```

   이 명령은 실행 가능한 `main.exe` 파일을 생성합니다.

## 다음 단계

* [Swift/Objective-C와의 상호 운용성에 대해 더 알아보기](native-objc-interop.md)
* [Apple 프레임워크로서의 Kotlin/Native 튜토리얼 확인하기](apple-framework.md)