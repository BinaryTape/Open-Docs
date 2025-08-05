[//]: # (title: Ant)

> 從 Kotlin 2.2.0 開始，Kotlin 對 Ant 建置系統的支援已棄用。
> 我們計畫在 Kotlin 2.3.0 中移除對 Ant 的支援。
> 
> 然而，如果您有興趣成為 Ant 的外部維護者，
> 請在 [此 YouTrack 問題](https://youtrack.jetbrains.com/issue/KT-75875/) 中留下評論。
> 
{style="warning"}

## 取得 Ant 任務

Kotlin 為 Ant 提供了三個任務：

*   `kotlinc`: 以 JVM 為目標的 Kotlin 編譯器
*   `kotlin2js`: 以 JavaScript 為目標的 Kotlin 編譯器
*   `withKotlin`: 當使用標準的 *javac* Ant 任務時，用於編譯 Kotlin 檔案的任務

這些任務定義在 *kotlin-ant.jar* 函式庫中，該函式庫位於 [Kotlin 編譯器](%kotlinLatestUrl%) 壓縮檔的 `lib` 資料夾中。需要 Ant 1.8.2+ 版本。

## 使用純 Kotlin 原始碼以 JVM 為目標

當專案僅包含 Kotlin 原始碼時，最簡單的編譯方式是使用 `kotlinc` 任務：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

其中 `${kotlin.lib}` 指向 Kotlin 獨立編譯器解壓縮後的資料夾。

## 使用純 Kotlin 原始碼和多個根目錄以 JVM 為目標

如果專案包含多個原始碼根目錄，請使用 `src` 作為元素來定義路徑：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc output="hello.jar">
            <src path="root1"/>
            <src path="root2"/>
        </kotlinc>
    </target>
</project>
```

## 使用 Kotlin 和 Java 原始碼以 JVM 為目標

如果專案同時包含 Kotlin 和 Java 原始碼，雖然可以使用 `kotlinc`，但為避免任務參數重複，建議使用 `withKotlin` 任務：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <delete dir="classes" failonerror="false"/>
        <mkdir dir="classes"/>
        <javac destdir="classes" includeAntRuntime="false" srcdir="src">
            <withKotlin/>
        </javac>
        <jar destfile="hello.jar">
            <fileset dir="classes"/>
        </jar>
    </target>
</project>
```

您也可以將要編譯的模組名稱指定為 `moduleName` 屬性：

```xml
<withKotlin moduleName="myModule"/>
```

## 以 JavaScript 為目標（單一原始碼資料夾）

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## 以 JavaScript 為目標（包含 Prefix、Postfix 和 sourcemap 選項）

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 以 JavaScript 為目標（單一原始碼資料夾和 metaInfo 選項）

`metaInfo` 選項在您想將轉譯結果分發為 Kotlin/JavaScript 函式庫時很有用。如果 `metaInfo` 設定為 `true`，那麼在編譯期間將會建立一個包含二進位中繼資料的額外 JS 檔案。此檔案應與轉譯結果一同分發：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js 將會被建立，其中包含二進位中繼資料 -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## 參考資料

以下列出了元素和屬性的完整清單：

### `kotlinc` 和 `kotlin2js` 共用的屬性

| 名稱 | 說明 | 必填 | 預設值 |
|------|-------------|----------|---------------|
| `src`  | 要編譯的 Kotlin 原始碼檔案或目錄 | 是 |  |
| `nowarn` | 抑制所有編譯警告 | 否 | `false` |
| `noStdlib` | 不將 Kotlin 標準函式庫包含到類別路徑中 | 否 | `false` |
| `failOnError` | 如果在編譯期間偵測到錯誤，則建置失敗 | 否 | `true` |

### `kotlinc` 屬性

| 名稱 | 說明 | 必填 | 預設值 |
|------|-------------|----------|---------------|
| `output`  | 目標目錄或 .jar 檔案名稱 | 是 |  |
| `classpath`  | 編譯類別路徑 | 否 |  |
| `classpathref`  | 編譯類別路徑參考 | 否 |  |
| `includeRuntime`  | 如果 `output` 是一個 .jar 檔案，Kotlin 執行時期函式庫是否應包含在 jar 中 | 否 | `true`  |
| `moduleName` | 正在編譯的模組名稱 | 否 | 目標名稱（如果指定）或專案名稱 |

### `kotlin2js` 屬性

| 名稱 | 說明 | 必填 |
|------|-------------|----------|
| `output`  | 目標檔案 | 是 |
| `libraries`  | Kotlin 函式庫路徑 | 否 |
| `outputPrefix`  | 用於產生 JavaScript 檔案的前綴 | 否 |
| `outputSuffix` | 用於產生 JavaScript 檔案的後綴 | 否 |
| `sourcemap`  | 是否應產生 sourcemap 檔案 | 否 |
| `metaInfo`  | 是否應產生包含二進位描述符的中繼資料檔案 | 否 |
| `main`  | 編譯器產生的程式碼是否應呼叫 `main` 函數 | 否 |

### 傳遞原始編譯器引數

要傳遞自訂原始編譯器引數，您可以使用 `<compilerarg>` 元素，並帶有 `value` 或 `line` 屬性。這可以在 `<kotlinc>`、`<kotlin2js>` 和 `<withKotlin>` 任務元素中完成，如下所示：

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

當您執行 `kotlinc -help` 時，會顯示所有可用引數的完整清單。