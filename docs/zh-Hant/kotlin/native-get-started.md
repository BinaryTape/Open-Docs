[//]: # (title: 開始使用 Kotlin/Native)

在本教學中，您將學習如何建立一個 Kotlin/Native 應用程式。選擇最適合您的工具來建立您的應用程式：

*   **[IDE](#in-ide)**。在這裡，您可以從版本控制系統複製專案範本並在 IntelliJ IDEA 中使用它。
*   **[Gradle 建置系統](#using-gradle)**。為了更好地理解其內部運作原理，請手動為您的專案建立建置檔案。
*   **[命令列工具](#using-the-command-line-compiler)**。您可以使用 Kotlin/Native 編譯器（作為標準 Kotlin 發佈的一部分），並直接在命令列工具中建立應用程式。

    主控台編譯可能看起來簡單直接，但對於包含數百個檔案和程式庫的大型專案來說，其擴展性不佳。對於這類專案，我們建議使用 IDE 或建置系統。

透過 Kotlin/Native，您可以為[不同的目標](native-target-support.md)編譯，包括 Linux、macOS 和 Windows。雖然可以進行跨平台編譯，這表示使用一個平台為另一個平台編譯，但在本教學中，您將以您正在編譯的相同平台為目標。

> 如果您使用 Mac 並希望為 macOS 或其他 Apple 目標建立和執行應用程式，您還需要先安裝 [Xcode 命令列工具](https://developer.apple.com/download/)，啟動它並接受許可條款。
>
{style="note"}

## 在 IDE 中

在本節中，您將學習如何使用 IntelliJ IDEA 建立 Kotlin/Native 應用程式。您可以使用 Community Edition 和 Ultimate Edition。

### 建立專案

1.  下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/)。
2.  在 IntelliJ IDEA 中，透過選擇 **File** | **New** | **Project from Version Control** 並使用此 URL 來複製[專案範本](https://github.com/Kotlin/kmp-native-wizard)：

    ```none
    https://github.com/Kotlin/kmp-native-wizard
    ```

3.  開啟 `gradle/libs.versions.toml` 檔案，這是專案依賴項的版本目錄 (version catalog)。要建立 Kotlin/Native 應用程式，您需要 Kotlin Multiplatform Gradle 插件 (plugin)，其版本與 Kotlin 相同。請確保您使用最新的 Kotlin 版本：

    ```none
    [versions]
    kotlin = "%kotlinVersion%"
    ```

4.  依照建議重新載入 Gradle 檔案：

    ![載入 Gradle 變更按鈕](load-gradle-changes.png){width=295}

有關這些設定的更多資訊，請參閱 [Multiplatform Gradle DSL 參考](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。

### 建置並執行應用程式

開啟 `src/nativeMain/kotlin/` 目錄中的 `Main.kt` 檔案：

*   `src` 目錄包含 Kotlin 原始碼檔案。
*   `Main.kt` 檔案包含使用 [`println()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/println.html) 函數印出 "Hello, Kotlin/Native!" 的程式碼。

按下邊欄中的綠色圖示以執行程式碼：

![執行應用程式](native-run-gutter.png){width=478}

IntelliJ IDEA 使用 Gradle 任務執行程式碼並將結果輸出到 **Run** (執行) 索引標籤中：

![應用程式輸出](native-output-gutter-1.png){width=331}

第一次執行後，IDE 會在頂部建立對應的執行設定 (run configuration)：

![Gradle 執行設定](native-run-config.png){width=503}

> IntelliJ IDEA Ultimate 使用者可以安裝 [Native Debugging Support](https://plugins.jetbrains.com/plugin/12775-native-debugging-support) 插件 (plugin)，該插件允許偵錯編譯的 native 可執行檔，並自動為匯入的 Kotlin/Native 專案建立執行設定 (run configurations)。

您可以[設定 IntelliJ IDEA](https://www.jetbrains.com/help/idea/compiling-applications.html#auto-build) 以自動建置您的專案：

1.  導覽至 **Settings | Build, Execution, Deployment | Compiler**。
2.  在 **Compiler** (編譯器) 頁面上，選擇 **Build project automatically** (自動建置專案)。
3.  套用變更。

現在，當您在類別檔案中進行變更或儲存檔案 (<shortcut>Ctrl + S</shortcut>/<shortcut>Cmd + S</shortcut>) 時，IntelliJ IDEA 會自動執行專案的增量建置 (incremental build)。

### 更新應用程式

讓我們為您的應用程式添加一個功能，使其可以計算您姓名中的字母數量：

1.  在 `Main.kt` 檔案中，新增程式碼以讀取輸入。使用 [`readln()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/readln.html) 函數讀取輸入值並將其指派給 `name` 變數：

    ```kotlin
    fun main() {
        // 讀取輸入值。
        println("Hello, enter your name:")
        val name = readln()
    }
    ```

2.  若要使用 Gradle 執行此應用程式，請在 `build.gradle.kts` 檔案中指定 `System.in` 作為要使用的輸入，然後載入 Gradle 變更：

    ```kotlin
    kotlin {
        //...
        nativeTarget.apply {
            binaries {
                executable {
                    entryPoint = "main"
                    runTask?.standardInput = System.`in`
                }
            }
        }
        //...
    }
    ```
    {initial-collapse-state="collapsed" collapsible="true" collapsed-title="runTask?.standardInput = System.`in`"}

3.  消除空格並計算字母：

    *   使用 [`replace()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace.html) 函數刪除姓名中的空白。
    *   使用範圍函數 (scope function) [`let`](scope-functions.md#let) 在物件上下文 (object context) 中執行函數。
    *   使用[字串範本](strings.md#string-templates)透過新增錢字號並將其括在花括號中（`${it.length}`）將姓名長度插入字串中。`it` 是[lambda 參數](coding-conventions.md#lambda-parameters)的預設名稱。

    ```kotlin
    fun main() {
        // 讀取輸入值。
        println("Hello, enter your name:")
        val name = readln()
        // 計算姓名中的字母數量。
        name.replace(" ", "").let {
            println("Your name contains ${it.length} letters")
        }
    }
    ```

4.  執行應用程式。
5.  輸入您的姓名並查看結果：

    ![應用程式輸出](native-output-gutter-2.png){width=422}

現在，讓我們只計算姓名中的唯一字母：

1.  在 `Main.kt` 檔案中，為 `String` 宣告新的[擴展函數](extensions.md#extension-functions) `.countDistinctCharacters()`：

    *   使用 [`.lowercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html) 函數將姓名轉換為小寫。
    *   使用 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-list.html) 函數將輸入字串轉換為字元列表。
    *   使用 [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) 函數只選取姓名中獨特的字元。
    *   使用 [`count()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/count.html) 函數計算獨特的字元。

    ```kotlin
    fun String.countDistinctCharacters() = lowercase().toList().distinct().count()
    ```

2.  使用 `.countDistinctCharacters()` 函數來計算您姓名中的唯一字母：

    ```kotlin
    fun String.countDistinctCharacters() = lowercase().toList().distinct().count()

    fun main() {
        // 讀取輸入值。
        println("Hello, enter your name:")
        val name = readln()
        // 計算姓名中的字母數量。
        name.replace(" ", "").let {
            println("Your name contains ${it.length} letters")
            // 印出唯一字母的數量。
            println("Your name contains ${it.countDistinctCharacters()} unique letters")
        }
    }
    ```

3.  執行應用程式。
4.  輸入您的姓名並查看結果：

    ![應用程式輸出](native-output-gutter-3.png){width=422}

## 使用 Gradle

在本節中，您將學習如何使用 [Gradle](https://gradle.org) 手動建立 Kotlin/Native 應用程式。Gradle 是 Kotlin/Native 和 Kotlin Multiplatform 專案的預設建置系統，也常應用於 Java、Android 和其他生態系統中。

### 建立專案檔案

1.  首先，請安裝相容版本的 [Gradle](https://gradle.org/install/)。請參閱[相容性表格](gradle-configure-project.md#apply-the-plugin)以檢查 Kotlin Gradle 插件 (KGP) 與可用 Gradle 版本的相容性。
2.  建立一個空的專案目錄。在其中，建立一個 `build.gradle(.kts)` 檔案，其內容如下：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    // build.gradle.kts
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        macosArm64("native") {  // 在 macOS 上
        // linuxArm64("native") // 在 Linux 上
        // mingwX64("native")   // 在 Windows 上
            binaries {
                executable()
            }
        }
    }

    tasks.withType<Wrapper> {
        gradleVersion = "%gradleVersion%"
        distributionType = Wrapper.DistributionType.BIN
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    // build.gradle
    plugins {
        id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    }

    repositories {
        mavenCentral()
    }

    kotlin {
        macosArm64('native') {  // 在 macOS 上
        // linuxArm64('native') // 在 Linux 上
        // mingwX64('native')   // 在 Windows 上
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

    您可以使用不同的[目標名稱](native-target-support.md)，例如 `macosArm64`、`iosArm64`、`linuxArm64` 和 `mingwX64` 來定義您編譯程式碼的目標。這些目標名稱可以選擇性地將平台名稱作為參數，在本例中為 `native`。平台名稱用於在專案中產生原始碼路徑和任務名稱。

3.  在專案目錄中建立一個空的 `settings.gradle(.kts)` 檔案。
4.  建立 `src/nativeMain/kotlin` 目錄並在其中放置一個 `hello.kt` 檔案，其內容如下：

    ```kotlin
    fun main() {
        println("Hello, Kotlin/Native!")
    }
    ```

依照慣例，所有原始碼都位於 `src/<目標名稱>[Main|Test]/kotlin` 目錄中，其中 `Main` 用於原始碼，`Test` 用於測試。`<目標名稱>` 對應於目標平台（在本例中為 `native`），如建置檔案中所指定。

### 建置並執行專案

1.  從專案根目錄執行建置命令：

    ```bash
    ./gradlew nativeBinaries
    ```

    此命令將建立 `build/bin/native` 目錄，其中包含兩個子目錄：`debugExecutable` 和 `releaseExecutable`。它們包含對應的二進位檔案。

    依預設，二進位檔案的名稱與專案目錄的名稱相同。

2.  若要執行專案，請執行以下命令：

    ```bash
    build/bin/native/debugExecutable/<project_name>.kexe
    ```

終端機將印出 "Hello, Kotlin/Native!"。

### 在 IDE 中開啟專案

現在，您可以在任何支援 Gradle 的 IDE 中開啟您的專案。如果您使用 IntelliJ IDEA：

1.  選擇 **File** | **Open**。
2.  選擇專案目錄並點擊 **Open**。IntelliJ IDEA 會自動偵測它是否為 Kotlin/Native 專案。

如果您在專案中遇到問題，IntelliJ IDEA 會在 **Build** (建置) 索引標籤中顯示錯誤訊息。

## 使用命令列編譯器

在本節中，您將學習如何在命令列工具中使用 Kotlin 編譯器建立 Kotlin/Native 應用程式。

### 下載並安裝編譯器

若要安裝編譯器：

1.  前往 Kotlin 的 [GitHub 發布頁面](%kotlinLatestUrl%)。
2.  尋找名稱中包含 `kotlin-native` 的檔案，並下載適合您作業系統的檔案，例如 `kotlin-native-prebuilt-linux-x86_64-2.0.21.tar.gz`。
3.  將壓縮檔解壓縮到您選擇的目錄。
4.  開啟您的 shell 設定檔並將編譯器 `/bin` 目錄的路徑新增到 `PATH` 環境變數：

    ```bash
    export PATH="/<path to the compiler>/kotlin-native/bin:$PATH"
    ```

> 雖然編譯器輸出沒有依賴項或虛擬機器要求，但編譯器本身需要 Java 1.8 或更高版本的執行時環境。它受 [JDK 8 (JAVA SE 8) 或更高版本](https://www.oracle.com/java/technologies/downloads/)的支援。
>
{style="note"}

### 建立程式

選擇一個工作目錄並建立一個名為 `hello.kt` 的檔案。將其內容更新為以下程式碼：

```kotlin
fun main() {
    println("Hello, Kotlin/Native!")
}
```

### 從主控台編譯程式碼

若要編譯應用程式，請使用下載的編譯器執行以下命令：

```bash
kotlinc-native hello.kt -o hello
```

`-o` 選項的值指定輸出檔案的名稱，因此此呼叫會在 macOS 和 Linux 上產生 `hello.kexe` 二進位檔案（在 Windows 上為 `hello.exe`）。

有關可用選項的完整列表，請參閱 [Kotlin 編譯器選項](compiler-reference.md)。

### 執行程式

若要執行程式，請在您的命令列工具中，導覽至包含二進位檔案的目錄並執行以下命令：

<tabs>
<tab title="macOS 和 Linux">

```none
./hello.kexe
```

</tab>
<tab title="Windows">

```none
./hello.exe
```

</tab>
</tabs>

應用程式將 "Hello, Kotlin/Native" 印出到標準輸出。

## 接下來做什麼？

*   完成 [使用 C 互操作和 libcurl 建立應用程式](native-app-with-c-and-libcurl.md) 教學，其中解釋了如何建立 native HTTP 用戶端並與 C 程式庫進行互操作。
*   學習如何為[實際的 Kotlin/Native 專案撰寫 Gradle 建置腳本](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-dsl-reference.html)。
*   在[文件](gradle.md)中閱讀更多關於 Gradle 建置系統的資訊。