[//]: # (title: Kotlin/Native 作為動態函式庫 – 教學課程)

你可以建立動態函式庫 (dynamic libraries) 以便在現有程式中使用 Kotlin 程式碼。這使得程式碼能夠在多個平台或語言之間共用，包括 JVM、Python、Android 等。

> 對於 iOS 和其他 Apple 目標平台，我們建議產生框架 (framework)。請參閱[Kotlin/Native 作為 Apple 框架](apple-framework.md)教學課程。
> 
{style="tip"}

你可以從現有原生應用程式或函式庫中使用 Kotlin/Native 程式碼。為此，你需要將 Kotlin 程式碼編譯成 `.so`、`.dylib` 或 `.dll` 格式的動態函式庫。

在本教學課程中，你將：

*   [將 Kotlin 程式碼編譯為動態函式庫](#create-a-kotlin-library)
*   [檢查產生的 C 標頭檔](#generated-header-file)
*   [從 C 使用 Kotlin 動態函式庫](#use-generated-headers-from-c)
*   [編譯並執行專案](#compile-and-run-the-project)

你可以使用命令列直接或透過指令碼檔案 (例如 `.sh` 或 `.bat` 檔案) 來產生 Kotlin 函式庫。然而，這種方法對於包含數百個檔案和函式庫的大型專案而言擴展性不佳。使用建構系統 (build system) 可以透過下載並快取 Kotlin/Native 編譯器二進位檔 (binaries) 和具有傳遞相依性 (transitive dependencies) 的函式庫，以及執行編譯器和測試來簡化此過程。Kotlin/Native 可以透過 [Kotlin Multiplatform 外掛程式](gradle-configure-project.md#targeting-multiple-platforms)使用 [Gradle](https://gradle.org) 建構系統。

讓我們來探討 Kotlin/Native 中與 C 互通 (interop) 相關的高級用法，以及使用 Gradle 進行的 [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms) 建構。

> 如果你使用 Mac 並想為 macOS 或其他 Apple 目標平台建立並執行應用程式，你還需要先安裝 [Xcode Command Line Tools](https://developer.apple.com/download/)，啟動它並接受授權條款。
>
{style="note"}

## 建立 Kotlin 函式庫

Kotlin/Native 編譯器可以從 Kotlin 程式碼產生動態函式庫。動態函式庫通常會帶有一個 `.h` 標頭檔，你用它來從 C 呼叫編譯後的程式碼。

讓我們建立一個 Kotlin 函式庫並從 C 程式中使用它。

> 如需詳細的入門步驟以及如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟它的說明，請參閱 [Kotlin/Native 入門](native-get-started.md#using-gradle)教學課程。
>
{style="tip"}

1.  導覽至 `src/nativeMain/kotlin` 目錄並建立 `lib.kt` 檔案，其中包含以下函式庫內容：

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

2.  使用以下內容更新你的 `build.gradle(.kts)` Gradle 建構檔：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // macOS on Apple Silicon
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS and Linux 
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
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }
    
    repositories {
        mavenCentral()
    }
    
    kotlin {
        macosArm64("native") {    // Apple Silicon macOS
        // macosX64("native") {   // macOS on x86_64 platforms
        // linuxArm64("native") { // Linux on ARM64 platforms
        // linuxX64("native") {   // Linux on x86_64 platforms
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS and Linux 
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

    *   `binaries {}` 區塊配置專案以產生動態或共享函式庫 (shared library)。
    *   `libnative` 用作函式庫名稱，它是產生標頭檔名稱的字首。它也作為標頭檔中所有宣告的字首。

3.  在 IDE 中執行 `linkDebugSharedNative` Gradle 工作 (task)，或在終端機中使用以下主控台指令來建構函式庫：

    ```bash
    ./gradlew linkDebugSharedNative
    ```

建構將函式庫產生到 `build/bin/native/debugShared` 目錄，其中包含以下檔案：

*   macOS: `libnative_api.h` 和 `libnative.dylib`
*   Linux: `libnative_api.h` 和 `libnative.so`
*   Windows: `libnative_api.h`、`libnative.def` 和 `libnative.dll`

> 你也可以使用 `linkNative` Gradle 工作來產生函式庫的 `debug` 和 `release` 兩種變體 (variants)。
> 
{style="tip"}

Kotlin/Native 編譯器使用相同的規則為所有平台產生 `.h` 檔案。讓我們看看 Kotlin 函式庫的 C API。

## 產生的標頭檔

讓我們檢查 Kotlin/Native 宣告如何對應到 C 函數。

在 `build/bin/native/debugShared` 目錄中，開啟 `libnative_api.h` 標頭檔。最開始的部分包含標準 C/C++ 標頭和註腳：

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

在此之後，`libnative_api.h` 包含一個區塊，其中有共同的型別定義：

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

Kotlin 對於在建立的 `libnative_api.h` 檔案中的所有宣告都使用 `libnative_` 字首。以下是型別對應的完整列表：

| Kotlin 定義          | C 型別                                        |
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

`libnative_api.h` 檔案的定義區段顯示了 Kotlin 基本型別 (primitive types) 如何對應到 C 基本型別。Kotlin/Native 編譯器會自動為每個函式庫產生這些項目。反向對應在 [從 C 對應基本資料型別](mapping-primitive-data-types-from-c.md)教學課程中描述。

在自動產生的型別定義之後，你會找到在你的函式庫中使用的獨立型別定義：

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

在 C 中，`typedef struct { ... } TYPE_NAME` 語法宣告了結構 (structure)。

> 請參閱 [此 StackOverflow 討論串](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)，以獲得關於此模式的更多解釋。
>
{style="tip"}

從這些定義中可以看出，Kotlin 型別使用相同的模式進行對應：`Object` 對應到 `libnative_kref_example_Object`，而 `Clazz` 對應到 `libnative_kref_example_Clazz`。所有結構只包含帶有指標 (pointer) 的 `pinned` 欄位 (field)。欄位型別 `libnative_KNativePtr` 在檔案前面定義為 `void*`。

由於 C 不支援命名空間 (namespaces)，Kotlin/Native 編譯器會產生長名稱，以避免與現有原生專案中的其他符號發生任何可能的衝突。

### 服務執行時間函數

`libnative_ExportedSymbols` 結構定義了 Kotlin/Native 和你的函式庫提供的所有函數。它大量使用巢狀匿名結構來模擬套件。`libnative_` 字首來自函式庫名稱。

`libnative_ExportedSymbols` 在標頭檔中包含幾個輔助函數 (helper functions)：

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

這些函數處理 Kotlin/Native 物件。`DisposeStablePointer` 用於釋放對 Kotlin 物件的引用 (reference)，而 `DisposeString` 用於釋放 Kotlin 字串，該字串在 C 中具有 `char*` 型別。

`libnative_api.h` 檔案的下一部分由執行時間函數 (runtime functions) 的結構宣告組成：

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

你可以使用 `IsInstance` 函數來檢查 Kotlin 物件 (透過其 `.pinned` 指標引用) 是否為某個型別的實例 (instance)。實際產生的一組操作取決於實際用法。

> Kotlin/Native 有自己的垃圾收集器 (garbage collector)，但它不管理從 C 存取的 Kotlin 物件。然而，Kotlin/Native 提供了與 Swift/Objective-C 的[互通性](native-objc-interop.md)，並且垃圾收集器[與 Swift/Objective-C ARC 整合](native-arc-integration.md)。
>
{style="tip"}

### 你的函式庫函數

讓我們來看看你的函式庫中使用的獨立結構宣告。`libnative_kref_example` 欄位透過 `libnative_kref.` 字首模擬 Kotlin 程式碼的套件結構：

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

此程式碼使用匿名結構宣告。在這裡，`struct { ... } foo` 在匿名結構型別的外部結構中宣告了一個欄位，該型別沒有名稱。

由於 C 也不支援物件，因此使用函數指標 (function pointers) 來模擬物件語意。函數指標被宣告為 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`。

`libnative_kref_example_Clazz` 欄位代表 Kotlin 中的 `Clazz`。`libnative_KULong` 可透過 `memberFunction` 欄位存取。唯一的區別是 `memberFunction` 接受 `thiz` 引用作為第一個參數。由於 C 不支援物件，因此 `thiz` 指標是明確地傳遞的。

在 `Clazz` 欄位中有一個建構子 (aka `libnative_kref_example_Clazz_Clazz`)，它作為建構函數來建立 `Clazz` 的實例。

Kotlin `object Object` 可作為 `libnative_kref_example_Object` 存取。`_instance` 函數檢索物件的唯一實例。

屬性 (Properties) 被轉換為函數。`get_` 和 `set_` 字首分別命名 getter 和 setter 函數。例如，Kotlin 中的唯讀屬性 `globalString` 在 C 中變成了 `get_globalString` 函數。

全域函數 (Global functions) `forFloats`、`forIntegers` 和 `strings` 在 `libnative_kref_example` 匿名結構中變成了函數指標。

### 進入點

現在你知道 API 是如何建立的，`libnative_ExportedSymbols` 結構的初始化是起始點。接下來讓我們看看 `libnative_api.h` 的最後一部分：

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 函數允許你打開從原生程式碼到 Kotlin/Native 函式庫的通道。這是存取函式庫的進入點 (entry point)。函式庫名稱用作函數名稱的字首。

> 可能有必要為每個執行緒託管 (host) 返回的 `libnative_ExportedSymbols*` 指標。
>
{style="note"}

## 從 C 使用產生的標頭檔

從 C 使用產生的標頭檔非常直接。在函式庫目錄中，建立 `main.c` 檔案，其中包含以下程式碼：

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

## 編譯並執行專案

### 在 macOS 上

為了編譯 C 程式碼並將其與動態函式庫連結 (link)，請導覽至函式庫目錄並執行以下指令：

```bash
clang main.c libnative.dylib
```

編譯器會產生一個名為 `a.out` 的可執行檔 (executable)。執行它以執行從 C 函式庫中的 Kotlin 程式碼。

### 在 Linux 上

為了編譯 C 程式碼並將其與動態函式庫連結，請導覽至函式庫目錄並執行以下指令：

```bash
gcc main.c libnative.so
```

編譯器會產生一個名為 `a.out` 的可執行檔。執行它以執行從 C 函式庫中的 Kotlin 程式碼。在 Linux 上，你需要將 `.` 包含到 `LD_LIBRARY_PATH` 中，以讓應用程式知道從當前資料夾載入 `libnative.so` 函式庫。

### 在 Windows 上

首先，你需要安裝支援 x64_64 目標的 Microsoft Visual C++ 編譯器。

最簡單的方法是在 Windows 機器上安裝 Microsoft Visual Studio。在安裝期間，請選擇與 C++ 開發相關的必要元件，例如 **Desktop development with C++**。

在 Windows 上，你可以透過產生靜態函式庫包裝器 (wrapper) 或手動使用 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) 或類似的 Win32API 函數來包含動態函式庫。

讓我們使用第一個選項並為 `libnative.dll` 產生靜態包裝器函式庫：

1.  從工具鏈 (toolchain) 呼叫 `lib.exe` 以產生靜態函式庫包裝器 `libnative.lib`，它會自動化程式碼中的 DLL 使用：

    ```bash
    lib /def:libnative.def /out:libnative.lib
    ```

2.  將你的 `main.c` 編譯成可執行檔。將產生的 `libnative.lib` 包含在建構指令中並啟動：

    ```bash
    cl.exe main.c libnative.lib
    ```

    該指令會產生 `main.exe` 檔案，你可以執行它。

## 接下來

*   [了解更多關於與 Swift/Objective-C 互通的資訊](native-objc-interop.md)
*   [查看 Kotlin/Native 作為 Apple 框架的教學課程](apple-framework.md)