[//]: # (title: 從 C 語言映射原始資料類型 – 教學)

<tldr>
    <p>這是<strong>映射 Kotlin 與 C</strong> 系列教學的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>從 C 語言映射原始資料類型</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">從 C 語言映射結構 (struct) 和聯合 (union) 類型</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> <a href="mapping-function-pointers-from-c.md">映射函式指標 (function pointers)</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">從 C 語言映射字串</a><br/>
    </p>
</tldr>

> C 函式庫的匯入為 [實驗性 (Experimental)](components-stability.md#stability-levels-explained)。所有由 cinterop 工具從 C 函式庫產生的 Kotlin 宣告都應具有 `@ExperimentalForeignApi` 註釋。
>
> 隨 Kotlin/Native 提供的原生平台函式庫（如 Foundation、UIKit 和 POSIX）僅需對某些 API 進行選用 (opt-in)。
>
{style="warning"}

讓我們探討哪些 C 資料類型在 Kotlin/Native 中可見，反之亦然，並檢視 Kotlin/Native 和 [多平台 (multiplatform)](gradle-configure-project.md#targeting-multiple-platforms) Gradle 建置中與 C 互通 (C interop) 相關的進階用例。

在本教學中，您將：

*   [了解 C 語言中的資料類型](#types-in-c-language)
*   [建立一個使用這些類型進行匯出的 C 函式庫](#create-a-c-library)
*   [檢查從 C 函式庫生成的 Kotlin API](#inspect-generated-kotlin-apis-for-a-c-library)

您可以使用命令列來產生 Kotlin 函式庫，直接或透過腳本檔案（例如 `.sh` 或 `.bat` 檔案）皆可。然而，對於包含數百個檔案和函式庫的大型專案而言，這種方法擴展性不佳。使用建置系統 (build system) 可透過下載和快取 Kotlin/Native 編譯器二進位檔 (compiler binaries) 和帶有傳遞性依賴 (transitive dependencies) 的函式庫，以及執行編譯器和測試來簡化此過程。Kotlin/Native 可以透過 [Kotlin Multiplatform 外掛程式 (plugin)](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建置系統。

## C 語言中的類型

C 程式語言具有以下 [資料類型](https://en.wikipedia.org/wiki/C_data_types)：

*   基本類型：`char, int, float, double` 及修飾符 `signed, unsigned, short, long`
*   結構 (Structures)、聯合 (Unions)、陣列 (Arrays)
*   指標 (Pointers)
*   函式指標 (Function pointers)

還有更具體的類型：

*   布林類型（來自 [C99](https://en.wikipedia.org/wiki/C99)）
*   `size_t` 和 `ptrdiff_t`（還有 `ssize_t`）
*   固定寬度整數類型，例如 `int32_t` 或 `uint64_t`（來自 [C99](https://en.wikipedia.org/wiki/C99)）

C 語言中還有以下類型限定符 (type qualifiers)：`const`、`volatile`、`restrict`、`atomic`。

讓我們看看哪些 C 資料類型在 Kotlin 中可見。

## 建立 C 函式庫

在本教學中，您無需建立 `lib.c` 原始碼檔案 (source file)，它僅在您想編譯 (compile) 和執行 (run) 您的 C 函式庫時才需要。對於此設定，您只需要一個 `.h` 標頭檔 (header file)，它是執行 [cinterop 工具](native-c-interop.md) 所必需的。

cinterop 工具為每組 `.h` 檔案產生一個 Kotlin/Native 函式庫（一個 `.klib` 檔案）。所產生的函式庫有助於橋接從 Kotlin/Native 到 C 的呼叫。它包含與 `.h` 檔案中的定義相對應的 Kotlin 宣告 (declarations)。

要建立 C 函式庫：

1.  為您未來的專案建立一個空資料夾。
2.  在其中建立一個 `lib.h` 檔案，包含以下內容，以了解 C 函式如何映射到 Kotlin 中：

    ```c
    #ifndef LIB2_H_INCLUDED
    #define LIB2_H_INCLUDED

    void ints(char c, short d, int e, long f);
    void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
    void doubles(float a, double b);
    
    #endif
    ```

    此檔案沒有 `extern "C"` 區塊，此範例中不需要它，但如果您使用 C++ 和重載函式 (overloaded functions)，則可能需要。請參閱此 [Stackoverflow 討論串](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c) 以獲取更多詳細資訊。

3.  建立 `lib.def` [定義檔案 (definition file)](native-definition-file.md)，包含以下內容：

    ```c
    headers = lib.h
    ```

4.  將巨集 (macros) 或其他 C 定義包含在由 cinterop 工具生成的程式碼中會很有幫助。這樣，方法主體 (method bodies) 也會被編譯並完全包含在二進位檔 (binary) 中。藉由這項功能，您無需 C 編譯器即可建立一個可執行的範例。

    為此，將 `lib.h` 檔案中 C 函式的實作 (implementations) 添加到一個新的 `interop.def` 檔案中，在 `---` 分隔符後方：

    ```c
    
    ---
     
    void ints(char c, short d, int e, long f) { }
    void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
    void doubles(float a, double b) { }
    ```

`interop.def` 檔案提供了在 IDE 中編譯、執行或開啟應用程式所需的一切。

## 建立 Kotlin/Native 專案

> 請參閱 [Kotlin/Native 入門](native-get-started.md#using-gradle) 教學，了解詳細的第一步和如何在 IntelliJ IDEA 中建立新的 Kotlin/Native 專案並開啟它的說明。
>
{style="tip"}

要建立專案檔案：

1.  在您的專案資料夾中，建立一個 `build.gradle(.kts)` Gradle 建置檔案，內容如下：

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
        // mingwX64("native") {   // on Windows
            val main by compilations.getting
            val interop by main.cinterops.creating
        
            binaries {
                executable()
            }
        }
    }
    
    tasks.wrapper {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.BIN
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
            compilations.main.cinterops {
                interop 
            }
        
            binaries {
                executable()
            }
        }
    }
    
    wrapper {
        gradleVersion = '%gradleVersion%'
        distributionType = 'BIN'
    }
    ```

    </tab>
    </tabs>

    專案檔案將 C 互通 (C interop) 配置為額外的建置步驟 (build step)。查看 [Multiplatform Gradle DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html) 以了解您可以配置它的不同方式。

2.  將您的 `interop.def`、`lib.h` 和 `lib.def` 檔案移動到 `src/nativeInterop/cinterop` 目錄。
3.  建立一個 `src/nativeMain/kotlin` 目錄。這是您應該放置所有原始碼檔案 (source files) 的位置，遵循 Gradle 關於使用慣例 (conventions) 而非配置 (configurations) 的建議。

    預設情況下，所有來自 C 的符號 (symbols) 都會匯入到 `interop` 封裝 (package) 中。

4.  在 `src/nativeMain/kotlin` 中，建立一個 `hello.kt` 存根檔案 (stub file)，內容如下：

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

    您稍後將在了解 C 原始類型宣告 (primitive type declarations) 在 Kotlin 端如何呈現時，完成程式碼。

## 檢查 C 函式庫生成的 Kotlin API

讓我們看看 C 原始類型 (primitive types) 如何映射到 Kotlin/Native 中，並相應地更新範例專案。

使用 IntelliJ IDEA 的 [前往宣告 (Go to declaration)](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>)，導覽至以下為 C 函式生成的 API：

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 類型被直接映射，除了 `char` 類型，它被映射到 `kotlin.Byte`，因為它通常是一個 8 位元的有符號值 (signed value)：

| C 語言             | Kotlin        |
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

## 更新 Kotlin 程式碼

現在您已經看到了 C 定義，您可以更新您的 Kotlin 程式碼了。`hello.kt` 檔案中的最終程式碼可能如下所示：

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

為了驗證一切如預期般運作，請在 [您的 IDE](native-get-started.md#build-and-run-the-application) 中執行 `runDebugExecutableNative` Gradle 任務 (task)，或使用以下命令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您將學習結構 (struct) 和聯合 (union) 類型如何在 Kotlin 和 C 之間映射：

**[繼續閱讀下一部分](mapping-struct-union-types-from-c.md)**

### 另請參閱

在涵蓋更進階情境的 [與 C 互通 (Interoperability with C)](native-c-interop.md) 文件中了解更多資訊。