---
title: "Kotlin 命令列編譯器"
---
每個 Kotlin 版本都附帶一個獨立的編譯器版本。您可以手動或透過套件管理器下載最新版本。

:::note
安裝命令列編譯器並非使用 Kotlin 的必要步驟。
常見的做法是使用具有官方 Kotlin 支援的 IDE 或程式碼編輯器（例如 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 或 [Android Studio](https://developer.android.com/studio)）編寫 Kotlin 應用程式。
它們提供開箱即用的完整 Kotlin 支援。

了解如何[開始在 IDE 中使用 Kotlin](getting-started)。

:::

## 安裝編譯器

### 手動安裝

若要手動安裝 Kotlin 編譯器：

1. 從 [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 下載最新版本 (`kotlin-compiler-2.1.20.zip`)。
2. 將獨立編譯器解壓縮到一個目錄中，並選擇性地將 `bin` 目錄新增到系統路徑。
`bin` 目錄包含在 Windows、macOS 和 Linux 上編譯和執行 Kotlin 所需的腳本。

:::note
如果您想在 Windows 上使用 Kotlin 命令列編譯器，我們建議手動安裝。

:::

### SDKMAN!

在基於 UNIX 的系統（例如 macOS、Linux、Cygwin、FreeBSD 和 Solaris）上安裝 Kotlin 的一種更簡單的方法是
[SDKMAN!](https://sdkman.io)。它也適用於 Bash 和 ZSH shell。[了解如何安裝 SDKMAN!](https://sdkman.io/install)。

若要透過 SDKMAN! 安裝 Kotlin 編譯器，請在終端機中執行以下命令：

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

1. 在 Kotlin 中建立一個簡單的控制台 JVM 應用程式，顯示 `"Hello, World!"`。
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

   * `-d` 選項指示產生的類別檔案的輸出路徑，該路徑可以是目錄或 **.jar** 檔案。
   * `-include-runtime` 選項透過在其中包含 Kotlin 運行時 (runtime)
函式庫，使產生的 **.jar** 檔案成為獨立且可執行的檔案。

   若要查看所有可用選項，請執行：

   ```bash
   kotlinc -help
   ```

3. 執行應用程式：

   ```bash
   java -jar hello.jar
   ```

## 編譯函式庫

如果您正在開發一個供其他 Kotlin 應用程式使用的函式庫，則可以在不包含 Kotlin 運行時 (runtime) 的情況下建構 **.jar** 檔案：

```bash
kotlinc hello.kt -d hello.jar
```

由於以這種方式編譯的二進位檔取決於 Kotlin 運行時 (runtime)，
因此您應確保在每次使用已編譯的函式庫時，它都存在於類別路徑 (classpath) 中。

您也可以使用 `kotlin` 腳本來執行 Kotlin 編譯器產生的二進位檔：

```bash
kotlin -classpath hello.jar HelloKt
```

`HelloKt` 是 Kotlin 編譯器為名為 `hello.kt` 的檔案產生的主類別名稱。

## 執行 REPL

您可以執行不帶參數的編譯器來擁有一個互動式 shell。在此 shell 中，您可以輸入任何有效的 Kotlin 程式碼
並查看結果。

<img src="/img/kotlin-shell.png" alt="Shell" width="500"/>

## 執行腳本

您可以將 Kotlin 用作腳本語言。
Kotlin 腳本是一個 Kotlin 原始碼檔案 (`.kts`)，其中包含最上層的可執行程式碼。

```kotlin
import java.io.File

// Get the passed in path, i.e. "-d some/path" or use the current path.
val path = if (args.contains("-d")) args[1 + args.indexOf("-d")]
           else "."

val folders = File(path).listFiles { file `->` file.isDirectory() }
folders?.forEach { folder `->` println(folder) }
```

若要執行腳本，請將 `-script` 選項傳遞給具有相應腳本檔案的編譯器：

```bash
kotlinc -script list_folders.kts -- -d <path_to_folder_to_inspect>
```

Kotlin 提供了對腳本自訂的實驗性支援，例如新增外部屬性、
提供靜態或動態依賴項等等。
自訂由所謂的 _腳本定義_ 定義 – 具有適當支援程式碼的帶註釋的 kotlin 類別。
腳本檔案名副檔名用於選擇適當的定義。
了解有關 [Kotlin 自訂腳本](custom-script-deps-tutorial) 的更多資訊。

當適當的 jar 包含在編譯類別路徑 (classpath) 中時，會自動偵測並應用正確準備的腳本定義。或者，您可以透過將 `-script-templates` 選項傳遞
給編譯器來手動指定定義：

```bash
kotlinc -script-templates org.example.CustomScriptDefinition -script custom.script1.kts
```

有關更多詳細資訊，請參閱 [KEEP-75](https://github.com/Kotlin/KEEP/blob/master/proposals/scripting-support)。