[//]: # (title: Kotlin/Native 作為動態程式庫 – 教學)

您可以建立動態程式庫，以便從現有的程式中使用 Kotlin 程式碼。這使得程式碼可以在多個平台或語言之間共用，包括 JVM、Python、Android 等。

> 對於 iOS 和其他 Apple 目標，我們建議產生框架。請參閱 [Kotlin/Native 作為 Apple 框架](apple-framework.md) 教學。
> 
{style="tip"}

您可以從現有的原生應用程式或程式庫中使用 Kotlin/Native 程式碼。為此，您需要將 Kotlin 程式碼編譯為 `.so`、`.dylib` 或 `.dll` 格式的動態程式庫。

在本教學中，您將：

* [將 Kotlin 程式碼編譯為動態程式庫](#create-a-kotlin-library)
* [檢查產生的 C 標頭檔](#generated-header-file)
* [從 C 使用 Kotlin 動態程式庫](#use-generated-headers-from-c)
* [編譯並執行專案](#compile-and-run-the-project)

您可以使用命令列直接產生 Kotlin 程式庫，或透過指令碼檔案（例如 `.sh` 或 `.bat` 檔案）來產生。然而，對於擁有數百個檔案和程式庫的大型專案，這種方法的擴充性並不佳。使用建置系統可以簡化流程，它會下載並快取 Kotlin/Native 編譯器執行檔以及具備遞迴相依性的程式庫，並執行編譯器和測試。Kotlin/Native 可以透過 [Kotlin Multiplatform 外掛程式](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建置系統。

讓我們來看看 Kotlin/Native 與 Gradle [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms) 建置中，與 C 互通相關的高階用法。

> 如果您使用 Mac 並想要為 macOS 或其他 Apple 目標建立並執行應用程式，您還需要先安裝 [Xcode Command Line Tools](https://developer.apple.com/download/)，啟動它並接受授權條款。
>
{style="note"}

## 建立 Kotlin 程式庫

Kotlin/Native 編譯器可以從 Kotlin 程式碼產生動態程式庫。動態程式庫通常附帶一個 `.h` 標頭檔，您可以使用它從 C 呼叫編譯後的程式碼。

讓我們建立一個 Kotlin 程式庫並從 C 程式中使用它。

> 關於詳細的初步步驟以及如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟的說明，請參閱 [Kotlin/Native 快速入門](native-get-started.md#using-gradle) 教學。
>
{style="tip"}

1. 前往 `src/nativeMain/kotlin` 目錄並建立包含以下程式庫內容的 `lib.kt` 檔案：

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

2. 使用以下內容更新您的 `build.gradle(.kts)` Gradle 建置檔案：

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
        macosArm64()    // Apple Silicon 上的 macOS
        // linuxArm64() // ARM64 平台上的 Linux
        // linuxX64()   // x86_64 平台上的 Linux
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
        macosArm64()    // Apple Silicon macOS
        // linuxArm64() // ARM64 平台上的 Linux
        // linuxX64()   // x86_64 平台上的 Linux
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

    * `binaries {}` 區塊將專案設定為產生動態或共用程式庫。
    * `libnative` 被用作程式庫名稱，它是產生的標頭檔名稱的前綴。它也是標頭檔中所有宣告的前綴。

3. 在 IDE 中執行 `linkDebugShared<YourTargetName>` Gradle 任務，或在終端機中使用主控台指令來建置程式庫，在此範例中為：

   ```bash
   ./gradlew linkDebugSharedMacosArm64
   ```

建置會在 `build/bin/<yourTargetName>/debugShared` 目錄中產生包含以下檔案的程式庫：

* macOS：`libnative_api.h` 和 `libnative.dylib`
* Linux：`libnative_api.h` 和 `libnative.so`
* Windows：`libnative_api.h`、`libnative.def` 和 `libnative.dll`

> 您也可以使用 `linkNative` Gradle 任務來同時產生程式庫的 `debug` 和 `release` 變體。 
> 
{style="tip"}

Kotlin/Native 編譯器使用相同的規則為所有平台產生 `.h` 檔案。讓我們來看看 Kotlin 程式庫的 C API。

## 產生的標頭檔

讓我們檢查 Kotlin/Native 宣告是如何對應到 C 函式的。

在 `build/bin/<yourTargetName>/debugShared` 目錄中，開啟 `libnative_api.h` 標頭檔。最前面的部分包含標準的 C/C++ 標頭和頁尾：

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// 產生的其餘程式碼

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

接著，`libnative_api.h` 包含一個具有常用型別定義的區塊：

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

Kotlin 在建立的 `libnative_api.h` 檔案中為所有宣告使用 `libnative_` 前綴。以下是型別對應的完整清單：

| Kotlin 定義             | C 型別                                         |
|------------------------|-----------------------------------------------|
| `libnative_KBoolean`   | `bool` 或 `_Bool`                             |
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

`libnative_api.h` 檔案的定義部分顯示了 Kotlin 基本型別如何對應到 C 基本型別。Kotlin/Native 編譯器會為每個程式庫自動產生這些項目。反向對應在 [從 C 對應基本資料型別](mapping-primitive-data-types-from-c.md) 教學中有詳細說明。

在自動產生的型別定義之後，您會發現程式庫中使用的獨立型別定義：

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// 自動產生的型別定義

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

在 C 中，`typedef struct { ... } TYPE_NAME` 語法用於宣告結構。

> 關於此模式的更多解釋，請參閱 [此 StackOverflow 討論串](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)。
>
{style="tip"}

從這些定義可以看出，Kotlin 型別按照相同的模式進行對應：`Object` 對應到 `libnative_kref_example_Object`，而 `Clazz` 對應到 `libnative_kref_example_Clazz`。所有的結構只包含一個帶有指標的 `pinned` 欄位。欄位型別 `libnative_KNativePtr` 在檔案的前面被定義為 `void*`。

由於 C 不支援命名空間，Kotlin/Native 編譯器會產生長名稱，以避免與現有原生專案中的其他符號發生任何可能的衝突。

### 服務執行時函式

`libnative_ExportedSymbols` 結構定義了 Kotlin/Native 和您的程式庫提供的所有函式。它大量使用了巢狀匿名結構來模仿套件。`libnative_` 前綴來自程式庫名稱。

`libnative_ExportedSymbols` 在標頭檔中包含了幾個協助程式函式：

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

這些函式用於處理 Kotlin/Native 物件。呼叫 `DisposeStablePointer` 是為了釋放對 Kotlin 物件的參考，而呼叫 `DisposeString` 是為了釋放 Kotlin 字串（在 C 中為 `char*` 型別）。

`libnative_api.h` 檔案的下一部分由執行時函式的結構宣告組成：

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

您可以使用 `IsInstance` 函式來檢查 Kotlin 物件（透過其 `.pinned` 指標參照）是否為某個型別的執行個體。產生的實際操作集取決於實際用法。

> Kotlin/Native 有自己的垃圾收集器，但它不管理從 C 存取的 Kotlin 物件。然而，Kotlin/Native 提供了 [與 Swift/Objective-C 的互通性](native-objc-interop.md)，且垃圾收集器已 [與 Swift/Objective-C ARC 整合](native-arc-integration.md)。
>
{style="tip"}

### 您的程式庫函式

讓我們來看看您的程式庫中使用的獨立結構宣告。`libnative_kref_example` 欄位模仿了 Kotlin 程式碼的套件結構，並帶有 `libnative_kref.` 前綴：

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

程式碼使用了匿名結構宣告。在這裡，`struct { ... } foo` 在匿名結構型別的外層結構中宣告了一個欄位，該欄位沒有名稱。

由於 C 也不支援物件，因此使用函式指標來模仿物件語意。函式指標宣告為 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`。

`libnative_kref_example_Clazz` 欄位代表 Kotlin 中的 `Clazz`。可以透過 `memberFunction` 欄位存取 `libnative_KULong`。唯一的區別是 `memberFunction` 接受一個 `thiz` 參考作為第一個參數。由於 C 不支援物件，因此會明確傳遞 `thiz` 指標。

`Clazz` 欄位中（即 `libnative_kref_example_Clazz_Clazz`）有一個建構函式，它作為建構函式來建立 `Clazz` 的執行個體。

Kotlin 的 `object Object` 可以作為 `libnative_kref_example_Object` 存取。`_instance` 函式用於取得該物件的唯一執行個體。

屬性被轉換為函式。`get_` 和 `set_` 前綴分別命名取得方法 (getter) 和設定方法 (setter) 函式。例如，Kotlin 中的唯讀屬性 `globalString` 在 C 中被轉換為 `get_globalString` 函式。

全域函式 `forFloats`、`forIntegers` 和 `strings` 在 `libnative_kref_example` 匿名結構中被轉換為函式指標。

### 進入點

現在您知道 API 是如何建立的了，`libnative_ExportedSymbols` 結構的初始化就是起點。接著讓我們看看 `libnative_api.h` 的最後一部分：

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 函式允許您開啟從原生程式碼到 Kotlin/Native 程式庫的入口。這是存取程式庫的進入點。程式庫名稱被用作函式名稱的前綴。

> 可能需要為每個執行緒託管回傳的 `libnative_ExportedSymbols*` 指標。
>
{style="note"}

## 從 C 使用產生的標頭檔

從 C 使用產生的標頭檔非常簡單。在程式庫目錄中，建立包含以下程式碼的 `main.c` 檔案：

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // 獲取呼叫 Kotlin/Native 函式的參考
  libnative_ExportedSymbols* lib = libnative_symbols();

  lib->kotlin.root.example.forIntegers(1, 2, 3, 4);
  lib->kotlin.root.example.forFloats(1.0f, 2.0);

  // 使用 C 和 Kotlin/Native 字串
  const char* str = "Hello from Native!";
  const char* response = lib->kotlin.root.example.strings(str);
  printf("in: %s
out:%s
", str, response);
  lib->DisposeString(response);

  // 建立 Kotlin 物件執行個體
  libnative_kref_example_Clazz newInstance = lib->kotlin.root.example.Clazz.Clazz();
  long x = lib->kotlin.root.example.Clazz.memberFunction(newInstance, 42);
  lib->DisposeStablePointer(newInstance.pinned);

  printf("DemoClazz returned %ld
", x);

  return 0;
}
```

## 編譯並執行專案

### 在 macOS 上

要編譯 C 程式碼並將其與動態程式庫連結，請前往程式庫目錄並執行以下指令：

```bash
clang main.c libnative.dylib
```

編譯器會產生一個名為 `a.out` 的可執行檔。執行它以從 C 程式庫執行 Kotlin 程式碼。

### 在 Linux 上

要編譯 C 程式碼並將其與動態程式庫連結，請前往程式庫目錄並執行以下指令：

```bash
gcc main.c libnative.so
```

編譯器會產生一個名為 `a.out` 的可執行檔。執行它以從 C 程式庫執行 Kotlin 程式碼。在 Linux 上，您需要將 `.` 加入 `LD_LIBRARY_PATH`，以便讓應用程式知道從目前資料夾載入 `libnative.so` 程式庫。

### 在 Windows 上

首先，您需要安裝支援 x64_64 目標的 Microsoft Visual C++ 編譯器。

最簡單的方法是在 Windows 電腦上安裝 Microsoft Visual Studio。安裝過程中，選擇處理 C++ 所需的組件，例如 **使用 C++ 的桌面開發**。

在 Windows 上，您可以透過產生靜態程式庫包裝函式，或使用 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) 或類似的 Win32API 函式手動包含動態程式庫。

讓我們使用第一個選項，並為 `libnative.dll` 產生靜態包裝程式庫：

1. 從工具鏈呼叫 `lib.exe` 以產生靜態程式庫包裝函式 `libnative.lib`，這能讓程式碼中的 DLL 使用自動化：

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. 將您的 `main.c` 編譯為可執行檔。將產生的 `libnative.lib` 包含在建置指令中並開始：

   ```bash
   cl.exe main.c libnative.lib
   ```

   該指令會產生 `main.exe` 檔案，您可以直接執行它。

## 下一步

* [進一步了解與 Swift/Objective-C 的互通性](native-objc-interop.md)
* [查看 Kotlin/Native 作為 Apple 框架教學](apple-framework.md)