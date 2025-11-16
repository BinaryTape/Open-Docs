[//]: # (title: Kotlin 命令列編譯器)

每個 Kotlin 版本都附帶一個獨立的編譯器版本。您可以手動或透過套件管理員下載最新版本。

> 安裝命令列編譯器並非使用 Kotlin 的必要步驟。
> 常見的方法是使用具備官方 Kotlin 支援的 IDE 或程式碼編輯器來編寫 Kotlin 應用程式，
> 例如 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 或 [Android Studio](https://developer.android.com/studio)。
> 它們提供開箱即用的完整 Kotlin 支援。
>
> 了解如何在 [IDE 中開始使用 Kotlin](getting-started.md)。
>
{style="note"}

## 安裝編譯器

### 手動安裝

若要手動安裝 Kotlin 編譯器：

1. 從 [GitHub Releases](%kotlinLatestUrl%) 下載最新版本 (`kotlin-compiler-%kotlinVersion%.zip`)。
2. 將獨立編譯器解壓縮到一個目錄中，並可選擇將 `kotlinc/bin` 目錄新增至系統路徑。
此 `bin` 目錄包含在 Windows、macOS 和 Linux 上編譯及執行 Kotlin 所需的腳本。

> 如果您想在 Windows 上使用 Kotlin 命令列編譯器，建議您手動安裝。
>
{style="note"}

### SDKMAN!

在諸如 macOS、Linux、Cygwin、FreeBSD 和 Solaris 等基於 UNIX 的系統上，安裝 Kotlin 更簡單的方法是
[SDKMAN!](https://sdkman.io)。它也適用於 Bash 和 ZSH shell。 [了解如何安裝 SDKMAN!](https://sdkman.io/install)。

若要透過 SDKMAN! 安裝 Kotlin 編譯器，請在終端機中執行以下命令：

```bash
sdk install kotlin
```

### Homebrew

或者，在 macOS 上您可以透過 [Homebrew](https://brew.sh/) 安裝編譯器：

```bash
brew update
brew install kotlin
```

### Snap 套件

如果您在 Ubuntu 16.04 或更高版本上使用 [Snap](https://snapcraft.io/)，您可以從命令列安裝編譯器：

```bash
sudo snap install --classic kotlin
```

## 建立並執行應用程式

1. 建立一個簡單的 Kotlin 主控台 JVM 應用程式，顯示 `"Hello, World!"`。
   在程式碼編輯器中，建立一個名為 `hello.kt` 的新檔案，並包含以下程式碼：

   ```kotlin
   fun main() {
       println("Hello, World!")
   }
   ```

2. 使用 Kotlin 編譯器編譯應用程式：

   ```bash
   kotlinc hello.kt -include-runtime -d hello.jar
   ```

   * `-d` 選項表示產生類別檔案的輸出路徑，該路徑可以是目錄或一個 **.jar** 檔案。
   * `-include-runtime` 選項透過將 Kotlin 執行時函式庫包含在內，使產生的 **.jar** 檔案成為獨立且可執行的。

   若要查看所有可用選項，請執行：

   ```bash
   kotlinc -help
   ```

3. 執行應用程式：

   ```bash
   java -jar hello.jar
   ```

> 若要編譯 Kotlin/Native 應用程式，請使用 [Kotlin/Native 編譯器](native-get-started.md#using-the-command-line-compiler)。
>
{style="note"}

## 編譯函式庫

如果您正在開發一個供其他 Kotlin 應用程式使用的函式庫，您可以在不包含 Kotlin 執行時的情況下建構該 **.jar** 檔案：

```bash
kotlinc hello.kt -d hello.jar
```

由於以此方式編譯的二進位檔依賴於 Kotlin 執行時，
因此您應確保每次使用編譯後的函式庫時，它都存在於類別路徑中。

您也可以使用 `kotlin` 腳本來執行由 Kotlin 編譯器產生的二進位檔：

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt` 是 Kotlin 編譯器為名為 `hello.kt` 的檔案產生主類別名稱。

> 若要編譯 Kotlin/Native 函式庫，請使用 [Kotlin/Native 編譯器](native-libraries.md#using-kotlin-native-compiler)。
>
{style="note"}

## 執行 REPL

使用 [`-Xrepl` 編譯器選項](compiler-reference.md#xrepl) 執行編譯器以獲得一個互動式 shell。在此 shell 中，您可以輸入任何有效的 Kotlin 程式碼並查看結果。

## 執行腳本

您可以將 Kotlin 用作腳本語言。
Kotlin 腳本是一個包含頂層可執行程式碼的 Kotlin 原始碼檔案 (`.kts`)。

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file -> file.isDirectory() }
folders?.forEach { folder -> println(folder) }
```

若要執行腳本，請將 `-script` 選項與對應的腳本檔案傳遞給編譯器：

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin 為腳本自訂提供了實驗性支援，例如新增外部屬性、提供靜態或動態依賴項等。
自訂功能由所謂的 _腳本定義_ 定義，這些是帶有適當支援程式碼的註解 Kotlin 類別。
腳本副檔名用於選擇適當的定義。
了解更多關於 [Kotlin 自訂腳本](custom-script-deps-tutorial.md) 的資訊。

適當準備的腳本定義會在編譯類別路徑中包含相應的 JARs 時，自動偵測並套用。或者，您可以透過將 `-script-templates` 選項傳遞給編譯器來手動指定定義：

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

有關更多詳細資訊，請參閱 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。

## 接下來呢？

[建立一個基於 Kotlin/JVM 的主控台應用程式](jvm-get-started.md)。