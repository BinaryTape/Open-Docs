[//]: # (title: 對應來自 C 的基本資料型別 – 教學)

<tldr>
    <p>這是<strong>對應 Kotlin 與 C</strong> 教學系列的第一部分。</p>
    <p><img src="icon-1.svg" width="20" alt="第一步"/> <strong>對應來自 C 的基本資料型別</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="第二步"/> <a href="mapping-struct-union-types-from-c.md">對應來自 C 的結構與等位型別</a><br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> <a href="mapping-function-pointers-from-c.md">對應來自 C 的函式指標</a><br/>
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> <a href="mapping-strings-from-c.md">對應來自 C 的字串</a><br/>
    </p>
</tldr>

> C 程式庫匯入目前處於 [Beta](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) 階段。所有由 cinterop 工具從 C 程式庫產生的 Kotlin 宣告都應具有 `@ExperimentalForeignApi` 註解。
>
> 隨 Kotlin/Native 提供的原生平台程式庫（如 Foundation、UIKit 和 POSIX）僅針對部分 API 需要進行選擇性加入（opt-in）。
>
{style="note"}

讓我們探索哪些 C 資料型別在 Kotlin/Native 中是可見的（反之亦然），並檢查與 Kotlin/Native C 互通相關的高階使用案例，以及 [多平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 組建。

在本教學中，你將：

* [了解 C 語言中的資料型別](#types-in-c-language)
* [建立一個在匯出中使用這些型別的 C 程式庫](#create-a-c-library)
* [檢查從 C 程式庫產生的 Kotlin API](#inspect-generated-kotlin-apis-for-a-c-library)

你可以使用命令列來產生 Kotlin 程式庫，可以直接產生或透過指令碼檔案（例如 `.sh` 或 `.bat` 檔案）。
然而，這種方法對於擁有數百個檔案和程式庫的大型專案來說擴充性不佳。
使用建構系統可以簡化程序，它會下載並快取 Kotlin/Native 編譯器二進位檔以及具有傳遞相依性的程式庫，並執行編譯器和測試。
Kotlin/Native 可以透過 [Kotlin 多平台外掛程式](gradle-configure-project.md#targeting-multiple-platforms) 使用 [Gradle](https://gradle.org) 建構系統。

## C 語言中的型別

C 程式語言具有以下 [資料型別](https://en.wikipedia.org/wiki/C_data_types)：

* 基本型別：`char, int, float, double` 以及修飾詞 `signed, unsigned, short, long`
* 結構（Structures）、等位（unions）、陣列（arrays）
* 指標（Pointers）
* 函式指標（Function pointers）

還有更具體的型別：

* 布林型別（來自 [C99](https://en.wikipedia.org/wiki/C99)）
* `size_t` 和 `ptrdiff_t`（還有 `ssize_t`）
* 固定寬度整數型別，例如 `int32_t` 或 `uint64_t`（來自 [C99](https://en.wikipedia.org/wiki/C99)）

C 語言中還有以下型別限定詞：`const`、`volatile`、`restrict`、`atomic`。

讓我們看看哪些 C 資料型別在 Kotlin 中是可見的。

## 建立一個 C 程式庫

在本教學中，你不需要建立 `lib.c` 原始碼檔案，只有在你想編譯並執行 C 程式庫時才需要它。對於此設定，你只需要一個執行 [cinterop 工具](native-c-interop.md) 所需的 `.h` 標頭檔。

cinterop 工具會為每一組 `.h` 檔案產生一個 Kotlin/Native 程式庫（`.klib` 檔案）。產生的程式庫有助於橋接從 Kotlin/Native 到 C 的呼叫。它包含與 `.h` 檔案中的定義相對應的 Kotlin 宣告。

要建立 C 程式庫：

1. 為你的未來專案建立一個空資料夾。
2. 在資料夾內建立一個 `lib.h` 檔案，內容如下，以查看 C 函式如何對應到 Kotlin：

   ```c
   #ifndef LIB2_H_INCLUDED
   #define LIB2_H_INCLUDED

   void ints(char c, short d, int e, long f);
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f);
   void doubles(float a, double b);
   
   #endif
   ```

   該檔案沒有 `extern "C"` 區塊，在此範例中不需要，但如果你使用 C++ 和多載函式，則可能需要。有關更多詳細資訊，請參閱此 [Stackoverflow 討論串](https://stackoverflow.com/questions/1041866/what-is-the-effect-of-extern-c-in-c)。

3. 建立具有以下內容的 `lib.def` [定義檔](native-definition-file.md)：

   ```c
   headers = lib.h
   ```

4. 在 cinterop 工具產生的程式碼中包含巨集或其他 C 定義會很有幫助。這樣一來，方法主體也會被編譯並完整包含在二進位檔中。透過此功能，你可以建立一個可執行的範例，而不需要 C 編譯器。

   為此，請在 `---` 分隔符號之後，將 `lib.h` 檔案中 C 函式的實作新增到新的 `interop.def` 檔案中：

   ```c
   
   ---
    
   void ints(char c, short d, int e, long f) { }
   void uints(unsigned char c, unsigned short d, unsigned int e, unsigned long f) { }
   void doubles(float a, double b) { }
   ```

`interop.def` 檔案提供了在 IDE 中編譯、執行或開啟應用程式所需的一切。

## 建立一個 Kotlin/Native 專案

> 有關詳細的初步步驟以及如何建立新的 Kotlin/Native 專案並在 IntelliJ IDEA 中開啟它的指示，請參閱 [Kotlin/Native 入門](native-get-started.md#using-gradle) 教學。
>
{style="tip"}

建立專案檔案：

1. 在你的專案資料夾中，建立一個具有以下內容的 `build.gradle(.kts)` Gradle 組建檔案：

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
        macosArm64("native") {    // macOS 於 Apple 晶片
        // macosX64("native") {   // macOS 於 x86_64 平台
        // linuxArm64("native") { // Linux 於 ARM64 平台 
        // linuxX64("native") {   // Linux 於 x86_64 平台
        // mingwX64("native") {   // 於 Windows
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
        macosArm64("native") {    // Apple 晶片 macOS
        // macosX64("native") {   // macOS 於 x86_64 平台
        // linuxArm64("native") { // Linux 於 ARM64 平台
        // linuxX64("native") {   // Linux 於 x86_64 平台
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

   專案檔案將 C 互通設定為額外的建置步驟。
   查看 [多平台 Gradle DSL 參考](https://kotlinlang.org/docs/multiplatform/multiplatform-dsl-reference.html) 以了解你可以設定它的不同方式。

2. 將你的 `interop.def`、`lib.h` 和 `lib.def` 檔案移至 `src/nativeInterop/cinterop` 目錄。
3. 建立 `src/nativeMain/kotlin` 目錄。這是你應該放置所有原始碼檔案的地方，遵循 Gradle 關於使用慣例而非配置的建議。

   預設情況下，來自 C 的所有符號都會匯入到 `interop` 套件中。

4. 在 `src/nativeMain/kotlin` 中，建立一個具有以下內容的 `hello.kt` 虛設常式檔案：

    ```kotlin
    import interop.*
    import kotlinx.cinterop.ExperimentalForeignApi

    @OptIn(ExperimentalForeignApi::class)
    fun main() {
        println("Hello Kotlin/Native!")
      
        ints(/* 修正我 */)
        uints(/* 修正我 */)
        doubles(/* 修正我 */)
    }
    ```

稍後當你了解 C 基本型別宣告在 Kotlin 端的外觀時，你將完成程式碼。

## 檢查從 C 程式庫產生的 Kotlin API

讓我們看看 C 基本型別如何對應到 Kotlin/Native，並據此更新範例專案。

使用 IntelliJ IDEA 的 [跳轉到宣告](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html) 指令（<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>）導覽至以下為 C 函式產生的 API：

```kotlin
fun ints(c: kotlin.Byte, d: kotlin.Short, e: kotlin.Int, f: kotlin.Long)
fun uints(c: kotlin.UByte, d: kotlin.UShort, e: kotlin.UInt, f: kotlin.ULong)
fun doubles(a: kotlin.Float, b: kotlin.Double)
```

C 型別是直接對應的，除了 `char` 型別，它被對應到 `kotlin.Byte`，因為它通常是一個 8 位元的帶正負號數值：

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

既然你已經看過 C 的定義，就可以更新你的 Kotlin 程式碼。`hello.kt` 檔案中的最終程式碼可能如下所示：

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

要驗證一切是否按預期運作，請 [在你的 IDE 中](native-get-started.md#build-and-run-the-application) 執行 `runDebugExecutableNative` Gradle 任務，或使用以下指令來執行程式碼：

```bash
./gradlew runDebugExecutableNative
```

## 下一步

在本系列的下一部分中，你將學習如何在 Kotlin 和 C 之間對應結構與等位型別：

**[繼續閱讀下一部分](mapping-struct-union-types-from-c.md)**

### 另請參閱

在 [與 C 互通性](native-c-interop.md) 文件中了解更多資訊，其中涵蓋了更進階的情境。