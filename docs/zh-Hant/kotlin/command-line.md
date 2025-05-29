[//]: # (title: Kotlin 命令列編譯器)

每個 Kotlin 版本都隨附一個獨立的編譯器版本。您可以手動或透過套件管理員下載最新版本。

> 安裝命令列編譯器並非使用 Kotlin 的必要步驟。
> 常見的方法是使用支援 Kotlin 的整合開發環境 (IDE) 或程式碼編輯器來編寫 Kotlin 應用程式，
> 例如 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 或 [Android Studio](https://developer.android.com/studio)。
> 它們開箱即用即可提供完整的 Kotlin 支援。
>
> 了解如何[在 IDE 中開始使用 Kotlin](getting-started.md)。
>
{style="note"}

## 安裝編譯器

### 手動安裝

要手動安裝 Kotlin 編譯器：

1. 從 [GitHub 版本](%kotlinLatestUrl%)下載最新版本 (`kotlin-compiler-%kotlinVersion%.zip`)。
2. 將獨立編譯器解壓縮到一個目錄中，並選擇性地將 `bin` 目錄新增到系統路徑。
`bin` 目錄包含在 Windows、macOS 和 Linux 上編譯和執行 Kotlin 所需的腳本。

> 如果您想在 Windows 上使用 Kotlin 命令列編譯器，我們建議手動安裝它。
>
{style="note"}

### SDKMAN!

在基於 UNIX 的系統（例如 macOS、Linux、Cygwin、FreeBSD 和 Solaris）上安裝 Kotlin 的一種更簡單方式是 [SDKMAN!](https://sdkman.io)。它也適用於 Bash 和 ZSH 殼層。[了解如何安裝 SDKMAN!](https://sdkman.io/install)。

要透過 SDKMAN! 安裝 Kotlin 編譯器，請在終端機中執行以下指令：

```bash
sdk install kotlin
```

### Homebrew

或者，在 macOS 上，您可以透過 [Homebrew](https://brew.sh/) 安裝編譯器：

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
   在程式碼編輯器中，建立一個名為 `hello.kt` 的新檔案，其中包含以下程式碼：

   ```kotlin
   fun main() {
       println("Hello, World!")
   }
   ```

2. 使用 Kotlin 編譯器編譯應用程式：

   ```bash
   kotlinc hello.kt -include-runtime -d hello.jar
   ```

   * `-d` 選項指定產生類別檔案的輸出路徑，其可以是目錄或一個 **.jar** 檔案。
   * `-include-runtime` 選項透過包含 Kotlin 執行時函式庫，使產生的 **.jar** 檔案成為獨立可執行的檔案。

   要查看所有可用選項，請執行：

   ```bash
   kotlinc -help
   ```

3. 執行應用程式：

   ```bash
   java -jar hello.jar
   ```

## 編譯函式庫

如果您正在開發一個供其他 Kotlin 應用程式使用的函式庫，您可以建置 **.jar** 檔案，但不包含 Kotlin 執行時：

```bash
kotlinc hello.kt -d hello.jar
```

由於以這種方式編譯的二進位檔依賴於 Kotlin 執行時，因此每當使用您編譯的函式庫時，都應確保它存在於類別路徑中。

您也可以使用 `kotlin` 腳本來執行由 Kotlin 編譯器產生的二進位檔：

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt` 是 Kotlin 編譯器為名為 `hello.kt` 的檔案產生主類別名稱。

## 執行 REPL

您可以不帶參數地執行編譯器以獲得一個互動式殼層。在此殼層中，您可以輸入任何有效的 Kotlin 程式碼並查看結果。

<img src="kotlin-shell.png" alt="Shell" width="500"/>

## 執行腳本

您可以將 Kotlin 作為腳本語言使用。
Kotlin 腳本是一個包含頂層可執行程式碼的 Kotlin 原始碼檔案 (`.kts`)。

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file -> file.isDirectory() }
folders?.forEach { folder -> println(folder) }
```

要執行腳本，請將 `-script` 選項與對應的腳本檔案傳遞給編譯器：

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin 為腳本客製化提供了實驗性支援，例如新增外部屬性、提供靜態或動態依賴等等。
客製化由所謂的 _腳本定義_ 定義 – 帶註解的 Kotlin 類別，並附帶相應的支援程式碼。
腳本檔案副檔名用於選擇適當的定義。
了解更多關於 [Kotlin 自訂腳本](custom-script-deps-tutorial.md)。

當編譯類別路徑中包含適當的 JAR 檔案時，妥善準備的腳本定義會被自動偵測並應用。或者，您可以透過將 `-script-templates` 選項傳遞給編譯器來手動指定定義：

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

如需更多詳細資訊，請參閱 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support.md)。