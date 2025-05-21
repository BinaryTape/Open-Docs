---
title: "Kotlin/Native 作為動態函式庫 – 教學"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

您可以建立動態函式庫（dynamic libraries），以便從現有程式中使用 Kotlin 程式碼。 這可以在許多平台或語言之間實現程式碼共享，包括 JVM、Python、Android 等。

:::note
對於 iOS 和其他 Apple 目標，我們建議產生 framework。 請參閱 [Kotlin/Native 作為 Apple framework](apple-framework) 教學課程。

您可以從現有的原生應用程式或函式庫中使用 Kotlin/Native 程式碼。 為此，您需要將 Kotlin 程式碼編譯成 `.so`、`.dylib` 或 `.dll` 格式的動態函式庫。

在本教學中，您將：

* [將 Kotlin 程式碼編譯為動態函式庫](#create-a-kotlin-library)
* [檢查產生的 C 標頭](#generated-header-file)
* [從 C 中使用 Kotlin 動態函式庫](#use-generated-headers-from-c)
* [編譯並執行專案](#compile-and-run-the-project)

您可以使用命令列直接或使用腳本檔案（例如 `.sh` 或 `.bat` 檔案）來產生 Kotlin 函式庫。
但是，對於具有數百個檔案和函式庫的大型專案來說，這種方法的可擴展性不佳。
使用建構系統可以簡化流程，方法是下載和快取 Kotlin/Native 編譯器二進制檔案和具有可轉移相依性的函式庫，以及執行編譯器和測試。
Kotlin/Native 可以透過 [Kotlin Multiplatform plugin](gradle-configure-project#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建構系統。

讓我們研究一下 Kotlin/Native 和使用 Gradle 的 [Kotlin Multiplatform](gradle-configure-project#targeting-multiple-platforms) 建構中與 C 互通相關的高階用法。

如果您使用 Mac 並且想要為 macOS 或其他 Apple 目標建立和執行應用程式，您還需要先安裝
[Xcode Command Line Tools](https://developer.apple.com/download/)，啟動它，然後接受授權條款。

:::

## 建立 Kotlin 函式庫

Kotlin/Native 編譯器可以從 Kotlin 程式碼產生動態函式庫。 動態函式庫通常附帶一個 `.h`
標頭檔，您可以使用它從 C 呼叫已編譯的程式碼。

讓我們建立一個 Kotlin 函式庫並從 C 程式中使用它。

:::note
請參閱 [Kotlin/Native 入門](native-get-started#using-gradle) 教學課程，以取得詳細的初步步驟
以及有關如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟它的說明。

1. 導覽至 `src/nativeMain/kotlin` 目錄，然後建立包含以下函式庫內容的 `lib.kt` 檔案：

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

2. 使用以下內容更新您的 `build.gradle(.kts)` Gradle 建構檔案：

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
        gradleVersion = "8.10"
        distributionType = "ALL"
    }
    ```

    </TabItem>
    </Tabs>

    * `binaries {}` 區塊將專案設定為產生動態或共享函式庫。
    * `libnative` 用作函式庫名稱，即產生的標頭檔案名稱的前綴。 它還為標頭檔案中的所有
      宣告加上前綴。

3. 在 IDE 中執行 `linkDebugSharedNative` Gradle 任務，或在您的終端機中使用以下控制台指令來建構
   函式庫：

   ```bash
   ./gradlew linkDebugSharedNative
   ```

建構會將函式庫產生到 `build/bin/native/debugShared` 目錄中，其中包含以下檔案：

* macOS：`libnative_api.h` 和 `libnative.dylib`
* Linux：`libnative_api.h` 和 `libnative.so`
* Windows：`libnative_api.h`、`libnative.def` 和 `libnative.dll`

您也可以使用 `linkNative` Gradle 任務來產生函式庫的 `debug` 和 `release` 變體。

Kotlin/Native 編譯器使用相同的規則來產生所有平台的 `.h` 檔案。 讓我們看看 Kotlin 函式庫的 C API。

## 產生的標頭檔案

讓我們檢查一下 Kotlin/Native 宣告如何對應到 C 函數。

在 `build/bin/native/debugShared` 目錄中，開啟 `libnative_api.h` 標頭檔案。
第一部分包含標準 C/C++ 標頭和頁尾：

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

在此之後，`libnative_api.h` 包含一個包含通用類型定義的區塊：

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

Kotlin 對於建立的 `libnative_api.h` 檔案中的所有宣告使用 `libnative_` 前綴。 這是類型對應的完整清單：

| Kotlin 定義            | C 類型                                        |
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

`libnative_api.h` 檔案的定義區段顯示 Kotlin 原始類型如何對應到 C 原始類型。
Kotlin/Native 編譯器會自動為每個函式庫產生這些條目。 
[從 C 對應原始資料類型](mapping-primitive-data-types-from-c) 教學課程中描述了反向對應。

在自動產生的類型定義之後，您會找到您函式庫中使用的單獨的類型定義：

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

在 C 中，`typedef struct { ... } TYPE_NAME` 語法宣告結構。

有關此模式的更多說明，請參閱 [此 StackOverflow 線程](https://stackoverflow.com/questions/1675351/typedef-struct-vs-struct-definitions)。

正如您可以從這些定義中看到的，Kotlin 類型使用相同的模式進行對應：`Object` 對應到
`libnative_kref_example_Object`，而 `Clazz` 對應到 `libnative_kref_example_Clazz`。 所有結構都只包含
具有指標的 `pinned` 欄位。 欄位類型 `libnative_KNativePtr` 在檔案前面定義為 `void*`。

由於 C 不支援命名空間，因此 Kotlin/Native 編譯器會產生長名稱，以避免與現有原生專案中的其他符號發生任何可能的衝突。

### 服務執行階段函數

`libnative_ExportedSymbols` 結構定義了 Kotlin/Native 和您的函式庫提供的所有函數。
它大量使用巢狀匿名結構來模擬套件。 `libnative_` 前綴來自函式庫名稱。

`libnative_ExportedSymbols` 在標頭檔案中包含多個輔助函數：

```c
typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libnative_KNativePtr ptr);
  void (*DisposeString)(const char* string);
```

這些函數處理 Kotlin/Native 物件。 呼叫 `DisposeStablePointer` 以釋放對 Kotlin 物件的引用，
呼叫 `DisposeString` 以釋放 Kotlin 字串，該字串在 C 中具有 `char*` 類型。

`libnative_api.h` 檔案的下一部分包含執行階段函數的結構宣告：

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

您可以使用 `IsInstance` 函數來檢查 Kotlin 物件（透過其 `.pinned` 指標引用）
是否為某個類型的實例。 產生的實際操作集取決於實際使用情況。

Kotlin/Native 有自己的垃圾收集器（garbage collector），但它不管理從 C 存取的 Kotlin 物件。 但是，
Kotlin/Native 提供 [與 Swift/Objective-C 的互通性](native-objc-interop)，
並且垃圾收集器已 [與 Swift/Objective-C ARC 集成](native-arc-integration)。

### 您的函式庫函數

讓我們看看您的函式庫中使用的單獨的結構宣告。 `libnative_kref_example` 欄位模仿
Kotlin 程式碼的套件結構，其中包含 `libnative_kref.` 前綴：

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

該程式碼使用匿名結構宣告。 在這裡，`struct { ... } foo` 宣告外部結構中類型為匿名結構的欄位，該結構沒有名稱。

由於 C 也不支援物件，因此函數指標用於模仿物件語意。 函數指標宣告為
`RETURN_TYPE (* FIELD_NAME)(PARAMETERS)`。

`libnative_kref_example_Clazz` 欄位表示來自 Kotlin 的 `Clazz`。 `libnative_KULong` 可透過
`memberFunction` 欄位存取。 唯一的區別是 `memberFunction` 接受 `thiz` 參考
作為第一個參數。 由於 C 不支援物件，因此 `thiz` 指標是明確傳遞的。

`Clazz` 欄位（又名 `libnative_kref_example_Clazz_Clazz`）中有一個建構函式，它充當建構函式
函數來建立 `Clazz` 的實例。

Kotlin `object Object` 可以作為 `libnative_kref_example_Object` 存取。 `_instance` 函數檢索物件的唯一實例。

屬性會轉換為函數。 `get_` 和 `set_` 前綴分別命名 getter 和 setter 函數。
例如，來自 Kotlin 的唯讀屬性 `globalString` 會轉換為 C 中的 `get_globalString`
函數。

全域函數 `forFloats`、`forIntegers` 和 `strings` 會轉換為 `libnative_kref_example`
匿名結構中的函數指標。

### 進入點

現在您知道如何建立 API，`libnative_ExportedSymbols` 結構的初始化是起點。
然後讓我們看看 `libnative_api.h` 的最後一部分：

```c
extern libnative_ExportedSymbols* libnative_symbols(void);
```

`libnative_symbols` 函數允許您開啟從原生程式碼到 Kotlin/Native 函式庫的閘道。
這是存取函式庫的進入點。 函式庫名稱用作函數名稱的前綴。

可能需要按執行緒託管傳回的 `libnative_ExportedSymbols*` 指標。

:::

## 從 C 中使用產生的標頭

從 C 中使用產生的標頭很簡單。 在函式庫目錄中，建立包含以下程式碼的 `main.c` 檔案：

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

若要編譯 C 程式碼並將其與動態函式庫連結，請導覽至函式庫目錄並執行以下指令：

```bash
clang main.c libnative.dylib
```

編譯器會產生一個名為 `a.out` 的可執行檔案。 執行它以從 C 函式庫執行 Kotlin 程式碼。

### 在 Linux 上

若要編譯 C 程式碼並將其與動態函式庫連結，請導覽至函式庫目錄並執行以下指令：

```bash
gcc main.c libnative.so
```

編譯器會產生一個名為 `a.out` 的可執行檔案。 執行它以從 C 函式庫執行 Kotlin 程式碼。 在 Linux 上，
您需要將 `.` 包含到 `LD_LIBRARY_PATH` 中，以使應用程式知道從目前資料夾載入 `libnative.so`
函式庫。

### 在 Windows 上

首先，您需要安裝支援 x64_64 目標的 Microsoft Visual C++ 編譯器。

最簡單的方法是在 Windows 機器上安裝 Microsoft Visual Studio。 在安裝期間，
選取使用 C++ 所需的元件，例如 **使用 C++ 的桌面開發**。

在 Windows 上，您可以透過產生靜態函式庫包裝函式或手動方式來包含動態函式庫
使用 [LoadLibrary](https://learn.microsoft.com/en-gb/windows/win32/api/libloaderapi/nf-libloaderapi-loadlibrarya)
或類似的 Win32API 函數。

讓我們使用第一個選項並為 `libnative.dll` 產生靜態包裝函式函式庫：

1. 從工具鏈呼叫 `lib.exe` 以產生靜態函式庫包裝函式 `libnative.lib`，該包裝函式會自動執行程式碼中的 DLL 用法：

   ```bash
   lib /def:libnative.def /out:libnative.lib
   ```

2. 將您的 `main.c` 編譯為可執行檔案。 將產生的 `libnative.lib` 包含到建構指令中並啟動：

   ```bash
   cl.exe main.c libnative.lib
   ```

   該指令會產生 `main.exe` 檔案，您可以執行該檔案。

## 後續步驟

* [了解更多關於與 Swift/Objective-C 的互通性](native-objc-interop)
* [查看 Kotlin/Native 作為 Apple framework 教學課程](apple-framework)
  ```