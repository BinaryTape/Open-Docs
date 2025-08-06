[//]: # (title: Kotlin/Native 作為動態函式庫 – 教學)

您可以建立動態函式庫，以在現有程式中使用 Kotlin 程式碼。這使得程式碼可以在多個平台或語言之間共享，包括 JVM、Python、Android 及其他。

> 對於 iOS 和其他 Apple 目標，我們建議產生一個框架 (framework)。請參閱 [Kotlin/Native 作為 Apple 框架](apple-framework.md) 教學。
> 
{style="tip"}

您可以從現有的原生應用程式或函式庫中使用 Kotlin/Native 程式碼。為此，您需要將 Kotlin 程式碼編譯為 `.so`、`.dylib` 或 `.dll` 格式的動態函式庫。

在本教學中，您將：

*   [將 Kotlin 程式碼編譯為動態函式庫](#create-a-kotlin-library)
*   [檢查產生的 C 標頭檔](#generated-header-file)
*   [從 C 語言中使用 Kotlin 動態函式庫](#use-generated-headers-from-c)
*   [編譯並執行專案](#compile-and-run-the-project)

您可以使用命令列直接或透過指令碼檔案（例如 `.sh` 或 `.bat` 檔案）來產生 Kotlin 函式庫。然而，對於包含數百個檔案和函式庫的大型專案，這種方法不易擴展。使用建置系統可以透過下載和快取 Kotlin/Native 編譯器二進位檔和具有遞移性依賴項的函式庫，以及執行編譯器和測試來簡化此流程。Kotlin/Native 可以透過 [Kotlin Multiplatform 外掛程式](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建置系統。

讓我們探討 Kotlin/Native 和 [Kotlin Multiplatform](gradle-configure-project.md#targeting-multiple-platforms) 建置在 Gradle 中與 C 互通的進階用法。

> 如果您使用 Mac 並想為 macOS 或其他 Apple 目標建立和執行應用程式，您還需要先安裝 [Xcode Command Line Tools](https://developer.apple.com/download/)，啟動它，並接受授權條款。
>
{style="note"}

## 建立 Kotlin 函式庫

Kotlin/Native 編譯器可以從 Kotlin 程式碼產生動態函式庫。動態函式庫通常附帶一個 `.h` 標頭檔，您可以用它來從 C 語言呼叫編譯後的程式碼。

讓我們建立一個 Kotlin 函式庫並從 C 程式中使用它。

> 有關詳細的入門步驟以及如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟的說明，請參閱 [Kotlin/Native 入門](native-get-started.md#using-gradle) 教學。
>
{style="tip"}

1.  導航到 `src/nativeMain/kotlin` 目錄並建立 `lib.kt` 檔案，其中包含以下函式庫內容：

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

2.  使用以下內容更新您的 `build.gradle(.kts)` Gradle 建置檔：

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
        macosArm64("native") {    // Apple Silicon 上的 macOS
        // macosX64("native") {   // x86_64 平台上的 macOS
        // linuxArm64("native") { // ARM64 平台上的 Linux
        // linuxX64("native") {   // x86_64 平台上的 Linux
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS 和 Linux 
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
        // macosX64("native") {   // x86_64 平台上的 macOS
        // linuxArm64("native") { // ARM64 平台上的 Linux
        // linuxX64("native") {   // x86_64 平台上的 Linux
        // mingwX64("native") {   // Windows
            binaries {
                sharedLib {
                    baseName = "native"       // macOS 和 Linux 
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

    *   `binaries {}` 區塊配置專案以生成動態或共享函式庫。
    *   `libnative` 用作函式庫名稱，也是產生之標頭檔名稱的前綴。它也將所有宣告加上前綴。

3.  在 IDE 中執行 `linkDebugSharedNative` Gradle 任務，或在終端機中使用以下控制台命令來建置函式庫：

    ```bash
    ./gradlew linkDebugSharedNative
    ```

建置將函式庫產生到 `build/bin/native/debugShared` 目錄中，包含以下檔案：

*   macOS: `libnative_api.h` 和 `libnative.dylib`
*   Linux: `libnative_api.h` 和 `libnative.so`
*   Windows: `libnative_api.h`、`libnative.def` 和 `libnative.dll`

> 您也可以使用 `linkNative` Gradle 任務來產生函式庫的 `debug` 和 `release` 變體。
> 
{style="tip"}

Kotlin/Native 編譯器使用相同的規則為所有平台產生 `.h` 檔案。讓我們來看看 Kotlin 函式庫的 C API。

## 產生的標頭檔

讓我們檢查 Kotlin/Native 宣告如何對應到 C 函式。

在 `build/bin/native/debugShared` 目錄中，開啟 `libnative_api.h` 標頭檔。最開始的部分包含標準 C/C++ 標頭和註腳：

```c
#ifndef KONAN_LIBNATIVE_H
#define KONAN_LIBNATIVE_H
#ifdef __cplusplus
extern "C" {
#endif

/// 其餘生成的程式碼

#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBNATIVE_H */
```

接著，`libnative_api.h` 包含一個常見型別定義區塊：

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

Kotlin 在建立的 `libnative_api.h` 檔案中，所有宣告都使用 `libnative_` 前綴。以下是完整的類型映射清單：

| Kotlin 定義          | C 類型                                        |
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

`libnative_api.h` 檔案的定義部分顯示了 Kotlin 基本類型如何對應到 C 基本類型。Kotlin/Native 編譯器會自動為每個函式庫產生這些項目。反向映射在 [從 C 映射基本資料類型](mapping-primitive-data-types-from-c.md) 教學中有所描述。

在自動生成的類型定義之後，您會找到函式庫中使用的獨立類型定義：

```c
struct libnative_KType;
typedef struct libnative_KType libnative_KType;

/// 自動生成的類型定義

typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Object;
typedef struct {
  libnative_KNativePtr pinned;
} libnative_kref_example_Clazz;
```

在 C 語言中，`typedef struct { ... } TYPE_NAME` 語法宣告了結構。

> 有關此模式的更多解釋，請參閱 [此 StackOverflow 討論串](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)。
>
{style="tip"}

從這些定義中可以看出，Kotlin 類型使用相同的模式進行映射：`Object` 映射到 `libnative_kref_example_Object`，而 `Clazz` 映射到 `libnative_kref_example_Clazz`。所有結構都只包含一個帶指標的 `pinned` 欄位。`libnative_KNativePtr` 欄位類型在此檔案前面定義為 `void*`。

由於 C 不支援命名空間，Kotlin/Native 編譯器會產生長名稱，以避免與現有原生專案中的其他符號產生任何可能的衝突。

### 服務執行時函式

`libnative_ExportedSymbols` 結構定義了 Kotlin/Native 和您的函式庫提供的所有函式。它大量使用巢狀匿名結構來模仿套件。`libnative_` 前綴來自函式庫名稱。

`libnative_ExportedSymbols` 在標頭檔中包含幾個輔助函式：

```c
typedef struct {
  /* 服務函式。*/
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

這些函式處理 Kotlin/Native 物件。`DisposeStablePointer` 用於釋放對 Kotlin 物件的引用，而 `DisposeString` 用於釋放 Kotlin 字串，其在 C 中為 `char*` 類型。

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
libnative_KChar (*getNonNullValueOfChar)(libnative_KChar);
libnative_kref_kotlin_Boolean (*createNullableBoolean)(libnative_KBoolean);
libnative_KBoolean (*getNonNullValueOfBoolean)(libnative_kref_kotlin_Boolean);
libnative_kref_kotlin_Unit (*createNullableUnit)(void);
libnative_kref_kotlin_UByte (*createNullableUByte)(libnative_KUByte);
libnative_KUByte (*getNonNullValueOfUByte)(libnative_kref_kotlin_UByte);
libnative_kref_kotlin_UShort (*createNullableUShort)(libnative_KUShort);
libnative_KUShort (*getNonNullValueOfUShort)(libnative_KUShort);
libnative_kref_kotlin_UInt (*createNullableUInt)(libnative_KUInt);
libnative_KUInt (*getNonNullValueOfUInt)(libnative_KUInt);
libnative_kref_kotlin_ULong (*createNullableULong)(libnative_KULong);
libnative_KULong (*getNonNullValueOfULong)(libnative_KULong);
```

您可以使用 `IsInstance` 函式檢查 Kotlin 物件（透過其 `.pinned` 指標引用）是否為某種類型的實例。實際生成的操作集取決於實際使用情況。

> Kotlin/Native 有自己的垃圾收集器，但它不管理從 C 語言存取的 Kotlin 物件。然而，Kotlin/Native 提供了 [與 Swift/Objective-C 的互通性](native-objc-interop.md)，且垃圾收集器 [與 Swift/Objective-C ARC 整合](native-arc-integration.md)。
>
{style="tip"}

### 您的函式庫函式

讓我們看看函式庫中使用的獨立結構宣告。`libnative_kref_example` 欄位以 `libnative_kref.` 前綴模仿 Kotlin 程式碼的套件結構：

```c
typedef struct {
  /* 使用者函式。*/
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

程式碼使用匿名結構宣告。在這裡，`struct { ... } foo` 在匿名結構類型的外部結構中宣告了一個欄位，該類型沒有名稱。

由於 C 也不支援物件，函式指標被用來模擬物件語義。函式指標宣告為 `RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`。

`libnative_kref_example_Clazz` 欄位代表 Kotlin 中的 `Clazz`。`libnative_KULong` 可透過 `memberFunction` 欄位存取。唯一的區別是 `memberFunction` 接受 `thiz` 參考作為第一個參數。由於 C 不支援物件，因此 `thiz` 指標是明確傳遞的。

`Clazz` 欄位（亦稱為 `libnative_kref_example_Clazz_Clazz`）中存在一個建構函式，它作為建構函式來建立 `Clazz` 的實例。

Kotlin `object Object` 可作為 `libnative_kref_example_Object` 存取。`_instance` 函式檢索該物件的唯一實例。

屬性被轉換為函式。`get_` 和 `set_` 前綴分別命名 getter 和 setter 函式。例如，Kotlin 中的唯讀屬性 `globalString` 在 C 中變為 `get_globalString` 函式。

全域函式 `forFloats`、`forIntegers` 和 `strings` 在 `libnative_kref_example` 匿名結構中變為函式指標。

### 進入點

現在您知道 API 如何建立，`libnative_ExportedSymbols` 結構的初始化是起點。讓我們接著看看 `libnative_api.h` 的最後部分：

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 函式允許您從原生程式碼開啟通往 Kotlin/Native 函式庫的閘道。這是存取函式庫的進入點。函式庫名稱用作函式名稱的前綴。

> 可能需要為每個執行緒託管返回的 `libnative_ExportedSymbols*` 指標。
>
{style="note"}

## 從 C 語言中使用 Kotlin 動態函式庫

從 C 語言中使用生成的標頭檔很直接。在函式庫目錄中，使用以下程式碼建立 `main.c` 檔案：

```c
#include "libnative_api.h"
#include "stdio.h"

int main(int argc, char** argv) {
  // 取得呼叫 Kotlin/Native 函式的引用
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

  // 建立 Kotlin 物件實例
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

若要編譯 C 程式碼並與動態函式庫連結，請導航到函式庫目錄並執行以下命令：

```bash
clang main.c libnative.dylib
```

編譯器會產生一個名為 `a.out` 的可執行檔。執行它以從 C 函式庫執行 Kotlin 程式碼。

### 在 Linux 上

若要編譯 C 程式碼並與動態函式庫連結，請導航到函式庫目錄並執行以下命令：

```bash
gcc main.c libnative.so
```

編譯器會產生一個名為 `a.out` 的可執行檔。執行它以從 C 函式庫執行 Kotlin 程式碼。在 Linux 上，您需要將 `.` 包含到 `LD_LIBRARY_PATH` 中，以便應用程式知道從當前資料夾載入 `libnative.so` 函式庫。

### 在 Windows 上

首先，您需要安裝支援 x64_64 目標的 Microsoft Visual C++ 編譯器。

最簡單的方法是在 Windows 機器上安裝 Microsoft Visual Studio。在安裝過程中，選擇使用 C++ 所需的元件，例如 **使用 C++ 的桌面開發**。

在 Windows 上，您可以透過產生靜態函式庫包裝器或手動使用 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya) 或類似的 Win32API 函式來包含動態函式庫。

讓我們使用第一個選項，為 `libnative.dll` 生成靜態包裝函式庫：

1.  從工具鏈呼叫 `lib.exe` 以產生靜態函式庫包裝器 `libnative.lib`，該函式庫可自動化程式碼中的 DLL 使用：

    ```bash
    lib /def:libnative.def /out:libnative.lib
    ```

2.  將您的 `main.c` 編譯成可執行檔。將生成的 `libnative.lib` 包含到建置命令中並啟動：

    ```bash
    cl.exe main.c libnative.lib
    ```

    該命令會產生 `main.exe` 檔案，您可以執行它。

## 接下來

*   [了解更多關於與 Swift/Objective-C 互通性](native-objc-interop.md)
*   [查看 Kotlin/Native 作為 Apple 框架教學](apple-framework.md)