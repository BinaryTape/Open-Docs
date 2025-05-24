---
title: "從 C 語言對應基本資料型別 – 教學"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::info
<p>
   這是 <strong>Kotlin 與 C 對應 (Mapping Kotlin and C)</strong> 教學系列的第一部分。
</p>
<p>
   <img src="/img/icon-1.svg" width="20" alt="First step"/> <strong>對應來自 C 的基本資料型別 (Mapping primitive data types from C)</strong><br/>
       <img src="/img/icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c">對應來自 C 的 struct 和 union 型別 (Mapping struct and union types from C)</a><br/>
       <img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c">對應函式指標 (Mapping function pointers)</a><br/>
       <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c">對應來自 C 的字串 (Mapping strings from C)</a><br/>
</p>

:::

:::tip
C 函式庫匯入是 [實驗性的 (Experimental)](components-stability#stability-levels-explained)。所有由 cinterop 工具從 C 函式庫產生的 Kotlin 宣告都應該帶有 `@ExperimentalForeignApi` 註解。

Kotlin/Native 隨附的原生平台函式庫 (例如 Foundation、UIKit 和 POSIX) 僅對某些 API 需要選擇加入 (opt-in)。

讓我們探討哪些 C 資料型別在 Kotlin/Native 中可見，反之亦然，並檢視 Kotlin/Native 與 [多平台 (multiplatform)](gradle-configure-project#targeting-multiple-platforms) Gradle 建置中 C 互通相關的進階使用案例。

在本教學中，您將：

* [了解 C 語言中的資料型別 (Learn about data types in the C language)](#types-in-c-language)
* [建立一個在匯出中使用這些型別的 C 函式庫 (Create a C Library that uses those types in exports)](#create-a-c-library)
* [檢視從 C 函式庫產生的 Kotlin API (Inspect generated Kotlin APIs from a C library)](#inspect-generated-kotlin-apis-for-a-c-library)

您可以使用命令列直接或使用腳本檔案 (例如 `.sh` 或 `.bat` 檔案) 產生 Kotlin 函式庫。
然而，對於具有數百個檔案和函式庫的大型專案，這種方法的可擴展性不佳。
使用建置系統可以簡化流程，方法是下載並快取 Kotlin/Native 編譯器二進位檔案和具有可轉移相依性的函式庫，以及執行編譯器和測試。
Kotlin/Native 可以透過 [Kotlin 多平台外掛程式 (Kotlin Multiplatform plugin)](gradle-configure-project#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建置系統。

## C 語言中的型別 (Types in C language)

C 程式語言具有以下 [資料型別 (data types)](https://en.wikipedia.org/wiki/C_data_types)：

* 基本型別：`char, int, float, double` 帶有修飾詞 `signed, unsigned, short, long`
* 結構 (Structures)、聯合 (unions)、陣列 (arrays)
* 指標 (Pointers)
* 函式指標 (Function pointers)

還有更多特定的型別：

* 布林型別 (Boolean type) (來自 [C99](https://en.wikipedia.org/wiki/C99))
* `size_t` 和 `ptrdiff_t` (以及 `ssize_t`)
* 固定寬度整數型別，例如 `int32_t` 或 `uint64_t` (來自 [C99](https://en.wikipedia.org/wiki/C99))

C 語言中還有以下型別限定詞 (type qualifiers)：`const`、`volatile`、`restrict`、`atomic`。

讓我們看看哪些 C 資料型別在 Kotlin 中可見。

## 建立 C 函式庫 (Create a C library)

在本教學中，您無需建立 `lib.c` 原始碼檔案，只有在您想要編譯和執行 C 函式庫時才需要。對於此設定，您只需要一個 `.h` 標頭檔，這是執行 [cinterop 工具](native-c-interop) 所必需的。

cinterop 工具會為每個 `.h` 檔案集產生一個 Kotlin/Native 函式庫 (一個 `.klib` 檔案)。產生的函式庫有助於橋接從 Kotlin/Native 到 C 的呼叫。它包含與 `.h` 檔案中的定義相對應的 Kotlin 宣告。

要建立 C 函式庫：

1. 為您的未來專案建立一個空資料夾。
2. 在其中，建立一個 `lib.h` 檔案，其中包含以下內容，以查看 C 函數如何對應到 Kotlin：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   該檔案沒有 `extern "C"` 區塊，此範例不需要它，但如果您使用 C++ 和多載函式，則可能需要。有關更多詳細信息，請參閱此 [Stackoverflow 討論串 (Stackoverflow thread)](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)。

3. 建立具有以下內容的 `lib.def` [定義檔 (definition file)](native-definition-file)：

   ```c
   headers = lib.h
   ```

4. 在 cinterop 工具產生的程式碼中包含巨集或其他 C 定義可能很有用。這樣，方法主體也會被編譯並完全包含在二進位檔案中。有了這個功能，您就可以建立一個可運行的範例，而無需 C 編譯器。

   為此，在 `---` 分隔符號後，將 `lib.h` 檔案中 C 函數的實現添加到新的 `interop.def` 檔案中：

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def` 檔案提供了編譯、運行或在 IDE 中打開應用程式所需的一切。

## 建立 Kotlin/Native 專案 (Create a Kotlin/Native project)

有關詳細的初步步驟以及如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中打開它，請參閱 [Kotlin/Native 入門 (Get started with Kotlin/Native)](native-get-started#using-gradle) 教學。

:::

要建立專案檔案：

1. 在您的專案資料夾中，建立一個 `build.gradle(.kts)` Gradle 建置檔案，其中包含以下內容：

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
        // mingwX64("native") {   // on Windows
            val main by compilations.getting
            val interop by main.cinterops.creating
        
            binaries {
                executable()
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "8.10"
        distributionType = Wrapper.DistributionType.BIN
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
            compilations.main.cinterops {
                interop 
            }
        
            binaries {
                executable()
            }
        }
    }
    
    wrapper {
        gradleVersion = '8.10'
        distributionType = 'BIN'
    }
    ```

    </TabItem>
    </Tabs>

   專案檔案將 C 互通配置為一個額外的建置步驟。
   查看 [多平台 Gradle DSL 參考 (Multiplatform Gradle DSL reference)](multiplatform-dsl-reference) 以了解您可以配置它的不同方式。

2. 將您的 `interop.def`、`lib.h` 和 `lib.def` 檔案移動到 `src/nativeInterop/cinterop` 目錄。
3. 建立一個 `src/nativeMain/kotlin` 目錄。您應該將所有原始碼檔案放置在此處，並遵循 Gradle 關於使用慣例而不是配置的建議。

   預設情況下，所有來自 C 的符號都會匯入到 `interop` 套件。

4. 在 `src/nativeMain/kotlin` 中，建立一個包含以下內容的 `hello.kt` 存根檔案：

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")
      
        ints(/* fix me*/)
        uints(/* fix me*/)
        doubles(/* fix me*/)
    }
    ```

您將在稍後學習 C 基本型別宣告從 Kotlin 端的樣子時完成程式碼。

## 檢視 C 函式庫產生的 Kotlin API (Inspect generated Kotlin APIs for a C library)

讓我們看看 C 基本型別如何對應到 Kotlin/Native，並相應地更新範例專案。

使用 IntelliJ IDEA 的 [前往宣告 (Go to declaration)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 以導航到以下為 C 函數產生的 API：

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 型別會直接對應，但 `char` 型別除外，它會對應到 `kotlin.Byte`，因為它通常是 8 位元的帶符號值：

| C                  | Kotlin        |
|--------------------|---------------|
| char               | kotlin.Byte   |
| unsigned char      | kotlin.UByte  |
| short              | kotlin.Short  |
| unsigned short     | kotlin.UShort |
| int                | kotlin.Int    |
| unsigned int       | kotlin.UInt   |
| long long          | kotlin.Long   |
| unsigned long long | kotlin.ULong  |
| float              | kotlin.Float  |
| double             | kotlin.Double |

## 更新 Kotlin 程式碼 (Update Kotlin code)

現在您已經看到了 C 定義，您可以更新您的 Kotlin 程式碼。`hello.kt` 檔案中的最終程式碼可能如下所示：

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")
  
    ints(1, 2, 3, 4)
    uints(5u, 6u, 7u, 8u)
    doubles(9.0f, 10.0)
}
```

為了驗證一切是否按預期工作，請 [在您的 IDE 中 (in your IDE)](native-get-started#build-and-run-the-application) 執行 `runDebugExecutableNative` Gradle 任務，或使用以下命令來運行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步 (Next step)

在本系列的下一部分中，您將學習 struct 和 union 型別如何在 Kotlin 和 C 之間對應：

**[前往下一部分 (Proceed to the next part)](mapping-struct-union-types-from-c)**

### 參見 (See also)

在 [與 C 的互通性 (Interoperability with C)](native-c-interop) 文件中了解更多信息，其中涵蓋了更高級的場景。