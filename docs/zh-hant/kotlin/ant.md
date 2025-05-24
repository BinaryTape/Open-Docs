---
title: Ant
---
## 取得 Ant 任務

Kotlin 為 Ant 提供了三個任務 (task)：

* `kotlinc`: Kotlin 編譯器，以 JVM 為目標
* `kotlin2js`: Kotlin 編譯器，以 JavaScript 為目標
* `withKotlin`: 在使用標準 *javac* Ant 任務時，編譯 Kotlin 檔案的任務

這些任務定義在 *kotlin-ant.jar* 函式庫中，該函式庫位於 [Kotlin 編譯器](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 壓縮檔的 `lib` 資料夾中。需要 Ant 1.8.2+ 版本。

## 使用純 Kotlin 原始碼以 JVM 為目標

當專案完全由 Kotlin 原始碼組成時，編譯專案最簡單的方法是使用 `kotlinc` 任務：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

其中 `${kotlin.lib}` 指向解壓縮 Kotlin 獨立編譯器的資料夾。

## 使用純 Kotlin 原始碼和多個根目錄以 JVM 為目標

如果專案由多個原始碼根目錄組成，請使用 `src` 作為元素來定義路徑：

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

如果專案由 Kotlin 和 Java 原始碼組成，雖然可以使用 `kotlinc`，但為了避免重複任務參數，建議使用 `withKotlin` 任務：

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

您還可以指定正在編譯的模組的名稱作為 `moduleName` 屬性：

```xml
<withKotlin moduleName="myModule"/>
```

## 使用單個原始碼資料夾以 JavaScript 為目標

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## 使用 Prefix、PostFix 和 sourcemap 選項以 JavaScript 為目標

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 使用單個原始碼資料夾和 metaInfo 選項以 JavaScript 為目標

如果您想將翻譯結果作為 Kotlin/JavaScript 函式庫分發，`metaInfo` 選項非常有用。 如果 `metaInfo` 設置為 `true`，則在編譯期間將建立帶有二進制元數據的附加 JS 檔案。 該檔案應與翻譯結果一起分發：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js will be created, which contains binary metadata -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## 參考文檔

以下列出了元素和屬性的完整清單：

### kotlinc 和 kotlin2js 的通用屬性

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `src`  | 要編譯的 Kotlin 原始檔或目錄 | Yes |  |
| `nowarn` | 抑制所有編譯警告 | No | false |
| `noStdlib` | 不將 Kotlin 標準函式庫包含到類別路徑 (classpath) 中 | No | false |
| `failOnError` | 如果在編譯期間檢測到錯誤，則構建失敗 | No | true |

### kotlinc 屬性

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `output`  | 目標目錄或 .jar 檔案名 | Yes |  |
| `classpath`  | 編譯類別路徑 | No |  |
| `classpathref`  | 編譯類別路徑引用 | No |  |
| `includeRuntime`  | 如果 `output` 是一個 .jar 檔案，是否將 Kotlin 執行時函式庫包含在 jar 中 | No | true  |
| `moduleName` | 正在編譯的模組的名稱 | No | 目標的名稱（如果指定）或專案 |

### kotlin2js 屬性

| Name | Description | Required |
|------|-------------|----------|
| `output`  | 目標檔案 | Yes |
| `libraries`  | Kotlin 函式庫的路徑 | No |
| `outputPrefix`  | 用於產生的 JavaScript 檔案的前綴 | No |
| `outputSuffix` | 用於產生的 JavaScript 檔案的後綴 | No |
| `sourcemap`  | 是否應產生 sourcemap 檔案 | No |
| `metaInfo`  | 是否應產生帶有二進制描述符的元數據檔案 | No |
| `main`  | 編譯器產生的程式碼是否應呼叫 main 函數 | No |

### 傳遞原始編譯器參數

要傳遞自定義原始編譯器參數，您可以使用帶有 `value` 或 `line` 屬性的 `<compilerarg>` 元素。 這可以在 `<kotlinc>`、`<kotlin2js>` 和 `<withKotlin>` 任務元素中完成，如下所示：

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

當您運行 `kotlinc -help` 時，會顯示可以使用的完整參數清單。