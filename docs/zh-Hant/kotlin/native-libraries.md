[//]: # (title: Kotlin/Native 程式庫)

## 程式庫編譯

你可以使用專案的組建檔案或 Kotlin/Native 編譯器來為你的程式庫產出 `*.klib` 構件。

### 使用 Gradle 組建檔案

你可以透過在 Gradle 組建檔案中指定 [Kotlin/Native 目標 (target)](native-target-support.md) 來編譯 `*.klib` 程式庫構件：

1. 在你的 `build.gradle(.kts)` 檔案中，宣告至少一個 Kotlin/Native 目標。例如：

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

2. 執行 `<target>Klib` 任務。例如：

   ```bash
   ./gradlew macosArm64Klib
   ```

Gradle 會自動編譯該目標的原始碼檔案，並在專案的 `build/libs` 目錄中產出 `.klib` 構件。

### 使用 Kotlin/Native 編譯器

若要使用 Kotlin/Native 編譯器產出程式庫：

1. [下載並安裝 Kotlin/Native 編譯器。](native-get-started.md#download-and-install-the-compiler)
2. 若要將 Kotlin/Native 原始碼檔案編譯成程式庫，請使用 `-produce library` 或 `-p library` 選項：

   ```bash
   kotlinc-native foo.kt -p library -o bar
   ```

   此指令會將 `foo.kt` 檔案的內容編譯成名為 `bar` 的程式庫，並產出 `bar.klib` 構件。

3. 若要將另一個檔案連結到程式庫，請使用 `-library <name>` 或 `-l <name>` 選項。例如：

   ```bash
   kotlinc-native qux.kt -l bar
   ```
   
   此指令會編譯 `qux.kt` 原始碼檔案與 `bar.klib` 程式庫的內容，並產出 `program.kexe` 最終可執行二進位檔案。

## klib 工具

**klib** 程式庫管理工具允許你使用以下語法檢查程式庫：

```bash
klib <command> <library path> [<option>]
```

目前可用的指令如下：

| 指令 | 描述 |
|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | 程式庫的一般資訊。 |
| `dump-abi`                    | 傾印程式庫的 ABI 快照。快照中的每一行都對應一個宣告。如果宣告發生了 ABI 不相容的變更，它將顯示在快照的對應行中。 |
| `dump-ir`                     | 將程式庫宣告的中間表示 (IR) 傾印到輸出中。僅用於偵錯。 |
| `dump-ir-signatures`          | 傾印所有非私有 (non-private) 程式庫宣告以及此程式庫所使用的所有非私有宣告的 IR 簽章（作為兩個獨立的列表）。此指令完全依賴於 IR 中的資料。 |
| `dump-ir-inlinable-functions` | 將程式庫中可內嵌函式 (inlinable functions) 的 IR 傾印到輸出中。僅用於偵錯。 |
| `dump-metadata`               | 將所有程式庫宣告的元資料傾印到輸出中。僅用於偵錯。 |
| `dump-metadata-signatures`    | 根據程式庫元資料傾印所有非私有程式庫宣告的 IR 簽章。在大多數情況下，輸出與 `dump-ir-signatures` 指令相同（該指令基於 IR 呈現簽章）。但是，如果在編譯期間使用了 IR 轉換編譯器外掛程式（例如 Compose），則修補後的宣告可能具有不同的簽章。 |

上述所有傾印指令都接受一個額外的 `-signature-version {N}` 引數，該引數指示 klib 工具在傾印簽章時應呈現哪個 IR 簽章版本。如果未提供，則使用程式庫支援的最新版本。例如：

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

此外，`dump-metadata` 指令接受 `-print-signatures {true|false}` 引數，指示 klib 工具為輸出中的每個宣告列印 IR 簽章。

## 建立與使用程式庫

1. 透過將原始碼放入 `kotlinizer.kt` 來建立程式庫：

   ```kotlin
   package kotlinizer

   val String.kotlinized
       get() = "Kotlin $this"
   ```

2. 將程式庫編譯成 `.klib`：

   ```bash
   kotlinc-native kotlinizer.kt -p library -o kotlinizer
   ```

3. 檢查目前目錄中建立的程式庫：

   ```bash
   ls kotlinizer.klib
   ```

4. 查看程式庫的一般資訊：

   ```bash
   klib info kotlinizer.klib
   ```

5. 在 `use.kt` 檔案中建立一個簡短的程式：

   ```kotlin
   import kotlinizer.*

   fun main(args: Array<String>) {
       println("Hello, ${"world".kotlinized}!")
   }
   ```

6. 編譯程式，將 `use.kt` 原始碼檔案連結到你的程式庫：

   ```bash
   kotlinc-native use.kt -l kotlinizer -o kohello
   ```

7. 執行程式：

   ```bash
   ./kohello.kexe
   ```

你應該會在輸出中看到 `Hello, Kotlin world!`。

## 程式庫搜尋順序

> 程式庫搜尋機制即將變更。請期待本章節的更新，並避免依賴已棄用的旗標。
> 
{style="note"}

當指定 `-library foo` 選項時，編譯器會按以下順序搜尋 `foo` 程式庫：

1. 目前編譯目錄或絕對路徑。
2. 安裝在預設儲存庫中的程式庫。

   > 預設儲存庫為 `~/.konan`。你可以透過設定 `konan.data.dir` Gradle 屬性來變更它。
   > 
   > 或者，你可以使用 `-Xkonan-data-dir` 編譯器選項，透過 `cinterop` 和 `konanc` 工具配置目錄的自訂路徑。
   > 
   {style="note"}

3. 安裝在 `$installation/klib` 目錄中的程式庫。

## 程式庫格式

Kotlin/Native 程式庫是包含預定義目錄結構的 zip 檔案，其佈局如下：

`foo.klib` 解包為 `foo/` 後會得到：

```text
- foo/
  - $component_name/
    - ir/
      - 序列化的 Kotlin IR。
    - targets/
      - $platform/
        - kotlin/
          - 編譯為 LLVM bitcode 的 Kotlin。
        - native/
          - 額外原生物件的 Bitcode 檔案。
      - $another_platform/
        - 可以有多個特定平台的 kotlin 和 native 配對。
    - linkdata/
      - 一組帶有序列化連結元資料的 ProtoBuf 檔案。
    - resources/
      - 一般資源，如圖片。（尚未投入使用）。
    - manifest - 一個描述程式庫的 java 屬性格式檔案。
```

你可以在 Kotlin/Native 編譯器安裝目錄的 `klib/common/stdlib` 中找到範例佈局。

## 在 klib 中使用相對路徑

原始碼檔案的序列化 IR 表示是 `klib` 程式庫的 [一部分](#library-format)。它包含檔案路徑，用於產生正確的偵錯資訊。預設情況下，儲存的路徑是絕對路徑。

透過 `-Xklib-relative-path-base` 編譯器選項，你可以變更格式並在構件中僅使用相對路徑。若要使其運作，請傳遞原始碼檔案的一個或多個基礎路徑作為引數：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base 是原始碼檔案的基礎路徑
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
        // $base 是原始碼檔案的基礎路徑
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
``` 

</tab>
</tabs>

## 下一步？

[了解如何使用 cinterop 工具產出 `*.klib` 構件](native-definition-file.md)