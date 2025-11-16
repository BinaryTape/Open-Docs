[//]: # (title: 從 C 語言映射基本資料型別 – 教學)

<tldr>
    <p>這是**映射 Kotlin 與 C** 教學系列的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> **從 C 語言映射基本資料型別**<br/>
       <img src="icon-2-todo.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">從 C 語言映射結構與聯集型別</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">從 C 語言映射函式指標</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">從 C 語言映射字串</a><br/>
    </p>
</tldr>

> C 函式庫匯入功能處於 [Beta](native-c-interop-stability.md) 階段。由 cinterop 工具從 C 函式庫生成的 Kotlin 宣告應具有 `@ExperimentalForeignApi` 註解。
>
> Kotlin/Native 隨附的原生平台函式庫（例如 Foundation、UIKit 和 POSIX）僅需要針對某些 API 選擇加入。
>
{style="note"}

讓我們探索哪些 C 資料型別在 Kotlin/Native 中可見，反之亦然，並探討 Kotlin/Native 和 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 建構中與 C interop 相關的進階用例。

在本教學中，您將：

*   [了解 C 語言中的資料型別](#types-in-c-language)
*   [建立一個在匯出中使用這些型別的 C 函式庫](#create-a-c-library)
*   [檢查從 C 函式庫生成的 Kotlin API](#inspect-generated-kotlin-apis-for-a-c-library)

您可以使用命令列來生成 Kotlin 函式庫，無論是直接生成還是透過腳本檔案（例如 `.sh` 或 `.bat` 檔案）。然而，這種方法不適用於擁有數百個檔案和函式庫的大型專案。使用建構系統可透過下載並快取 Kotlin/Native 編譯器二進位檔和具有轉譯相依性的函式庫，以及執行編譯器和測試來簡化過程。Kotlin/Native 可以透過 [Kotlin 多平台外掛程式](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建構系統。

## C 語言中的型別

C 程式語言具有以下 [資料型別](https://en.wikipedia.org/wiki/C_data_types)：

*   基本型別：`char, int, float, double` 以及修飾符 `signed, unsigned, short, long`
*   結構、聯集、陣列
*   指標
*   函式指標

還有更特定的型別：

*   布林型別（來自 [C99](https://en.wikipedia.org/wiki/C99)）
*   `size_t` 和 `ptrdiff_t`（還有 `ssize_t`）
*   固定寬度整數型別，例如 `int32_t` 或 `uint64_t`（來自 [C99](https://en.wikipedia.org/wiki/C99)）

C 語言中還有以下型別限定符：`const`、`volatile`、`restrict`、`atomic`。

讓我們看看哪些 C 資料型別在 Kotlin 中可見。

## 建立 C 函式庫

在本教學中，您不會建立 `lib.c` 原始檔，這只在您想要編譯並執行您的 C 函式庫時才需要。對於此設定，您只需要一個執行 [cinterop 工具](native-c-interop.md) 所需的 `.h` 標頭檔。

cinterop 工具會為每組 `.h` 檔案生成一個 Kotlin/Native 函式庫（一個 `.klib` 檔案）。生成的函式庫有助於橋接從 Kotlin/Native 到 C 的呼叫。它包含與 `.h` 檔案中的定義相對應的 Kotlin 宣告。

建立 C 函式庫：

1.  為您未來的專案建立一個空資料夾。
2.  在其中，建立一個 `lib.h` 檔案，其中包含以下內容，以查看 C 函式如何映射到 Kotlin：

    ```c
    #ifndef LIB2_H_INCLUDED
    #define LIB2_H_INCLUDED

    void ints(char c, short d, int e, long f);
    void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
    void doubles(float a, double b);
    
    #endif
    ```

    該檔案沒有 `extern "C"` 區塊，本範例不需要它，但如果您使用 C++ 和重載函式，則可能需要。請參閱此 [Stackoverflow 討論串](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c) 以獲取更多詳細資訊。

3.  建立 `lib.def` [定義檔](native-definition-file.md)，其中包含以下內容：

    ```c
    headers = lib.h
    ```

4.  將巨集或其他 C 定義包含在由 cinterop 工具生成的程式碼中會很有幫助。這樣，方法主體也會被編譯並完全包含在二進位檔中。藉由這項功能，您可以建立一個可執行的範例而不需要 C 編譯器。

    為此，請在 `---` 分隔符之後，將 `lib.h` 檔案中的 C 函式實作新增到新的 `interop.def` 檔案中：

    ```c
    
    ---
     
    void ints(char c, short d, int e, long f) { }
    void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
    void doubles(float a, double b) { }
    ```

`interop.def` 檔案提供了所有必要的內容，以便編譯、執行或在 IDE 中開啟應用程式。

## 建立 Kotlin/Native 專案

> 有關詳細的入門步驟以及如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟它的說明，請參閱 [Kotlin/Native 入門](native-get-started.md#using-gradle) 教學。
>
{style="tip"}

建立專案檔案：

1.  在您的專案資料夾中，建立一個 `build.gradle(.kts)` Gradle 建構檔案，其中包含以下內容：

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
        // mingwX64("native") {   // 在 Windows 上
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
        // macosX64("native") {   // macOS on x86_64 平台
        // linuxArm64("native") { // Linux on ARM64 平台
        // linuxX64("native") {   // Linux on x86_64 平台
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

    專案檔案將 C interop 配置為一個額外的建構步驟。請查看 [多平台 Gradle DSL 參考](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html) 以了解不同的配置方式。

2.  將您的 `interop.def`、`lib.h` 和 `lib.def` 檔案移動到 `src/nativeInterop/cinterop` 目錄。
3.  建立 `src/nativeMain/kotlin` 目錄。這裡就是您應該放置所有原始檔的地方，遵循 Gradle 關於使用約定而非配置的建議。

    預設情況下，所有來自 C 的符號都會匯入到 `interop` 套件中。

4.  在 `src/nativeMain/kotlin` 中，建立一個 `hello.kt` 骨架檔案，其中包含以下內容：

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

稍後您將完成程式碼，當您了解 C 基本型別宣告在 Kotlin 端如何呈現時。

## 檢查 C 函式庫生成的 Kotlin API

讓我們看看 C 基本型別是如何映射到 Kotlin/Native 的，並相應地更新範例專案。

使用 IntelliJ IDEA 的 [前往宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 命令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）導航到以下為 C 函式生成的 API：

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 型別是直接映射的，除了 `char` 型別，它被映射到 `kotlin.Byte`，因為它通常是一個 8 位元有符號值：

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

要驗證一切是否按預期運作，請[在您的 IDE 中](native-get-started.md#build-and-run-the-application)執行 `runDebugExecutableNative` Gradle 任務，或使用以下命令執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，您將學習結構和聯集型別如何在 Kotlin 和 C 之間映射：

**[進入下一部分](mapping-struct-union-types-from-c.md)**

### 參見

在 [與 C 的互通性](native-c-interop.md) 文件中了解更多，其中涵蓋了更進階的場景。