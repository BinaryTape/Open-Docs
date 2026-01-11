[//]: # (title: Kotlin/Native 函式庫)

## 函式庫編譯

您可以使用專案的建置檔案或 Kotlin/Native 編譯器為您的函式庫產生 `*.klib` 構件。

### 使用 Gradle 建置檔案

您可以透過在您的 Gradle 建置檔案中指定一個 [Kotlin/Native 目標](native-target-support.md)來編譯 `*.klib` 函式庫構件：

1.  在您的 `build.gradle(.kts)` 檔案中，宣告至少一個 Kotlin/Native 目標。例如：

    ```kotlin
    // build.gradle.kts
    plugins {
        kotlin("multiplatform") version "%kotlinVersion%"
    }
 
    kotlin {
        macosArm64()    // 在 macOS 上
        // linuxArm64() // 在 Linux 上
        // mingwX64()   // 在 Windows 上
    }
    ```

2.  執行 `<target>Klib` 任務。例如：

    ```bash
    ./gradlew macosArm64Klib
    ```

Gradle 會自動編譯該目標的原始檔，並在專案的 `build/libs` 目錄中產生 `.klib` 構件。

### 使用 Kotlin/Native 編譯器

若要使用 Kotlin/Native 編譯器產生函式庫：

1.  [下載並安裝 Kotlin/Native 編譯器。](native-get-started.md#download-and-install-the-compiler)
2.  若要將 Kotlin/Native 原始檔編譯為函式庫，請使用 `-produce library` 或 `-p library` 選項：

    ```bash
    kotlinc-native foo.kt -p library -o bar
    ```

    此指令會將 `foo.kt` 檔案的內容編譯為一個名為 `bar` 的函式庫，產生 `bar.klib` 構件。

3.  若要將另一個檔案連結至函式庫，請使用 `-library <name>` 或 `-l <name>` 選項。例如：

    ```bash
    kotlinc-native qux.kt -l bar
    ```
   
    此指令會編譯 `qux.kt` 原始檔和 `bar.klib` 函式庫的內容，並產生 `program.kexe` 最終可執行二進位檔。

## klib 工具程式

**klib** 函式庫管理工具程式允許您使用以下語法檢查函式庫：

```bash
klib <command> <library path> [<option>]
```

目前可用的指令如下：

| 指令                          | 描述                                                                                                                                                                                                                                                                                                                                                    |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | 關於函式庫的一般資訊。                                                                                                                                                                                                                                                                                                                                         |
| `dump-abi`                    | 傾印函式庫的 ABI 快照。快照中的每一行都對應一個宣告。如果宣告發生 ABI 不相容的變更，將會在快照的對應行中顯示。                                                                                                                                                                      |
| `dump-ir`                     | 將函式庫宣告的中介表示 (IR) 傾印到輸出。僅用於偵錯。                                                                                                                                                                                                                                                                                                           |
| `dump-ir-signatures`          | 傾印所有非 private 函式庫宣告以及此函式庫所使用的所有非 private 宣告的 IR 簽章 (作為兩個單獨的清單)。此指令純粹依賴於 IR 中的資料。                                                                                                                                                                    |
| `dump-ir-inlinable-functions` | 將函式庫中可內嵌函式的 IR 傾印到輸出。僅用於偵錯。                                                                                                                                                                                                                                                                                                            |
| `dump-metadata`               | 將所有函式庫宣告的 metadata 傾印到輸出。僅用於偵錯。                                                                                                                                                                                                                                                                                                           |
| `dump-metadata-signatures`    | 根據函式庫 metadata 傾印所有非 private 函式庫宣告的 IR 簽章。在大多數情況下，輸出與 `dump-ir-signatures` 指令的輸出相同，後者根據 IR 渲染簽章。然而，如果在編譯期間使用 IR 轉換編譯器外掛程式 (例如 Compose)，修補後的宣告可能會具有不同的簽章。 |

以上所有傾印指令都接受一個額外的 `-signature-version {N}` 引數，指示 klib 工具程式在傾印簽章時，應渲染哪種 IR 簽章版本。如果未提供，它會使用函式庫支援的最新版本。例如：

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

此外，`dump-metadata` 指令接受 `-print-signatures {true|false}` 引數，指示 klib 工具程式印出輸出中每個宣告的 IR 簽章。

## 建立和使用函式庫

1.  建立一個函式庫，將原始碼放入 `kotlinizer.kt` 中：

    ```kotlin
    package kotlinizer

    val String.kotlinized
        get() = "Kotlin $this"
    ```

2.  將函式庫編譯為 `.klib`：

    ```bash
    kotlinc-native kotlinizer.kt -p library -o kotlinizer
    ```

3.  檢查目前目錄中建立的函式庫：

    ```bash
    ls kotlinizer.klib
    ```

4.  查看函式庫的一般資訊：

    ```bash
    klib info kotlinizer.klib
    ```

5.  在 `use.kt` 檔案中建立一個簡短的程式：

    ```kotlin
    import kotlinizer.*

    fun main(args: Array<String>) {
        println("Hello, ${"world".kotlinized}!")
    }
    ```

6.  編譯程式，將 `use.kt` 原始檔連結至您的函式庫：

    ```bash
    kotlinc-native use.kt -l kotlinizer -o kohello
    ```

7.  執行程式：

    ```bash
    ./kohello.kexe
    ```

您應該會在輸出中看到 `Hello, Kotlin world!`。

## 函式庫搜尋順序

> 函式庫搜尋機制將會很快改變。請留意此區塊的更新，並避免依賴已棄用的旗標。
> 
{style="note"}

當給予 `-library foo` 選項時，編譯器會依照以下順序搜尋 `foo` 函式庫：

1.  目前的編譯目錄或絕對路徑。
2.  安裝在預設儲存庫中的函式庫。

    > 預設儲存庫是 `~/.konan`。您可以透過設定 `konan.data.dir` Gradle 屬性來更改它。
    > 
    > 或者，您可以透過 `cinterop` 和 `konanc` 工具使用 `-Xkonan-data-dir` 編譯器選項來設定自訂的目錄路徑。
    > 
    {style="note"}

3.  安裝在 `$installation/klib` 目錄中的函式庫。

## 函式庫格式

Kotlin/Native 函式庫是 zip 檔案，其中包含預先定義的目錄結構，佈局如下：

`foo.klib` 當解壓縮為 `foo/` 時，會得到：

```text
- foo/
  - $component_name/
    - ir/
      - 序列化的 Kotlin IR。
    - targets/
      - $platform/
        - kotlin/
          - 編譯為 LLVM 位元碼的 Kotlin。
        - native/
          - 額外原生物件的位元碼檔案。
      - $another_platform/
        - 可以有多個平台特定的 Kotlin 和原生配對。
    - linkdata/
      - 一組包含序列化連結 metadata 的 ProtoBuf 檔案。
    - resources/
      - 一般資源，例如影像。(尚未啟用)。
    - manifest - 一個以 Java 屬性格式描述函式庫的檔案。
```

您可以在您的 Kotlin/Native 編譯器安裝目錄中的 `klib/common/stdlib` 目錄中找到一個範例佈局。

## 在 klib 中使用相對路徑

原始檔的序列化 IR 表示是 `klib` 函式庫的[一部分](#library-format)。它包含用於產生正確偵錯資訊的檔案路徑。預設情況下，儲存的路徑是絕對路徑。

透過 `-Xklib-relative-path-base` 編譯器選項，您可以更改格式並僅在構件中使用相對路徑。為了使其運作，請傳遞一個或多個原始檔的基礎路徑作為引數：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base 是原始檔的基礎路徑
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base 是原始檔的基礎路徑
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</tab>
</tabs>

## 接下來呢？

[了解如何使用 cinterop 工具產生 `*.klib` 構件](native-definition-file.md)