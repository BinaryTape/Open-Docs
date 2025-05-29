[//]: # (title: Kotlin/Native 函式庫)

## Kotlin 編譯器細節

若要使用 Kotlin/Native 編譯器產生函式庫，請使用 `-produce library` 或 `-p library` 旗標。例如：

```bash
$ kotlinc-native foo.kt -p library -o bar
```

此命令將會產生一個包含 `foo.kt` 編譯內容的 `bar.klib` 檔案。

若要連結至函式庫，請使用 `-library <name>` 或 `-l <name>` 旗標。例如：

```bash
$ kotlinc-native qux.kt -l bar
```

此命令將會從 `qux.kt` 和 `bar.klib` 產生一個 `program.kexe` 執行檔。

## cinterop 工具細節

**cinterop** 工具的主要輸出是為原生函式庫產生 `.klib` 包裝器。
例如，使用您 Kotlin/Native 發行版中提供的簡單 `libgit2.def` 原生函式庫定義檔

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

我們將會得到 `libgit2.klib`。

更多詳情請參閱 [C 互通操作](native-c-interop.md)。

## klib 工具程式

**klib** 函式庫管理工具允許您檢查並安裝函式庫。

以下命令可用：

*   `content` – 列出函式庫內容：

  ```bash
  $ klib contents <name>
  ```

*   `info` – 檢查函式庫的帳務細節

  ```bash
  $ klib info <name>
  ```

*   `install` – 將函式庫安裝到預設位置，請使用

  ```bash
  $ klib install <name>
  ```

*   `remove` – 從預設儲存庫中移除函式庫，請使用

  ```bash
  $ klib remove <name>
  ```

所有上述命令都接受一個額外的 `-repository <directory>` 引數，用於指定不同於預設的儲存庫。

```bash
$ klib <command> <name> -repository <directory>
```

## 數個範例

首先讓我們建立一個函式庫。
將這個微小的函式庫原始碼放入 `kotlinizer.kt`：

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

函式庫已在目前目錄中建立：

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

現在讓我們查看函式庫的內容：

```bash
$ klib contents kotlinizer
```

您可以將 `kotlinizer` 安裝到預設儲存庫：

```bash
$ klib install kotlinizer
```

從目前目錄中移除其所有蹤跡：

```bash
$ rm kotlinizer.klib
```

建立一個非常簡短的程式並將其放入 `use.kt`：

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

現在編譯程式，並連結您剛建立的函式庫：

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

然後執行程式：

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

玩得愉快！

## 進階主題

### 函式庫搜尋順序

當給定 `-library foo` 旗標時，編譯器會依以下順序搜尋 `foo` 函式庫：

*   目前編譯目錄或絕對路徑。
*   所有以 `-repo` 旗標指定的儲存庫。
*   安裝在預設儲存庫中的函式庫。

   > 預設儲存庫是 `~/.konan`。您可以透過設定 `kotlin.data.dir` Gradle 屬性來更改它。
   >
   > 另外，您也可以使用 `-Xkonan-data-dir` 編譯器選項，透過 `cinterop` 和 `konanc` 工具來設定您的自訂目錄路徑。
   >
   {style="note"}

*   安裝在 `$installation/klib` 目錄中的函式庫。

### 函式庫格式

Kotlin/Native 函式庫是包含預定義目錄結構的 ZIP 檔案，其佈局如下：

當 `foo.klib` 解壓縮為 `foo/` 時，我們會得到：

```text
  - foo/
    - $component_name/
      - ir/
        - 序列化 Kotlin IR。
      - targets/
        - $platform/
          - kotlin/
            - 編譯為 LLVM 位元碼的 Kotlin。
          - native/
            - 額外原生物件的位元碼檔案。
        - $another_platform/
          - 可以有多個平台特定的 Kotlin 和原生配對。
      - linkdata/
        - 一組包含序列化連結元資料的 ProtoBuf 檔案。
      - resources/
        - 一般資源，例如圖片。（尚未啟用）。
      - manifest – 描述函式庫的 Java 屬性格式檔案。
```

您可以在安裝目錄的 `klib/stdlib` 中找到範例佈局。

### 在 klib 中使用相對路徑

> 在 klib 中使用相對路徑自 Kotlin 1.6.20 起可用。
>
{style="note"}

原始碼檔案的序列化 IR 表示形式是 `klib` 函式庫的 [一部分](#library-format)。它包含用於產生正確除錯資訊的檔案路徑。預設情況下，儲存的路徑是絕對路徑。
透過 `-Xklib-relative-path-base` 編譯器選項，您可以更改格式並僅在構件中使用相對路徑。若要使其運作，請傳遞一個或多個原始碼檔案的基準路徑作為引數：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base 是原始碼檔案的基準路徑
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
        // $base 是原始碼檔案的基準路徑
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
```

</tab>
</tabs>