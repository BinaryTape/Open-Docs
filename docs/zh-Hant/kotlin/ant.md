[//]: # (title: Ant)

## 獲取 Ant 任務

Kotlin 為 Ant 提供了三個任務：

*   `kotlinc`：針對 JVM 的 Kotlin 編譯器
*   `kotlin2js`：針對 JavaScript 的 Kotlin 編譯器
*   `withKotlin`：當使用標準 *javac* Ant 任務時，用於編譯 Kotlin 檔案的任務

這些任務定義在 *kotlin-ant.jar* 函式庫中，該函式庫位於 [Kotlin 編譯器](%kotlinLatestUrl%) 壓縮檔的 `lib` 資料夾內。需要 Ant 1.8.2 版或更高版本。

## 使用純 Kotlin 原始碼鎖定 JVM

當專案完全由 Kotlin 原始碼組成時，最簡單的編譯方式是使用 `kotlinc` 任務：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

其中 `${kotlin.lib}` 指向解壓縮 Kotlin 獨立編譯器所在的資料夾。

## 使用純 Kotlin 原始碼和多個根目錄鎖定 JVM

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

## 使用 Kotlin 和 Java 原始碼鎖定 JVM

如果專案同時包含 Kotlin 和 Java 原始碼，儘管可以使用 `kotlinc`，但為避免任務參數重複，建議使用 `withKotlin` 任務：

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

您也可以將正在編譯的模組名稱指定為 `moduleName` 屬性：

```xml
<withKotlin moduleName="myModule"/>
```

## 使用單一原始碼資料夾鎖定 JavaScript

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## 使用前綴、後綴和來源對應選項鎖定 JavaScript

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 使用單一原始碼資料夾和 metaInfo 選項鎖定 JavaScript

如果您想將翻譯結果作為 Kotlin/JavaScript 函式庫發佈，則 `metaInfo` 選項會很有用。如果 `metaInfo` 設定為 `true`，那麼在編譯期間將會建立一個包含二進位中繼資料的額外 JS 檔案。此檔案應與翻譯結果一起發佈：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js will be created, which contains binary metadata -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## 參考資料

完整的元素和屬性列表如下：

### kotlinc 和 kotlin2js 的通用屬性

| 名稱 | 描述 | 必填 | 預設值 |
|------|-------------|----------|---------------|
| `src`  | 要編譯的 Kotlin 原始碼檔案或目錄 | 是 |  |
| `nowarn` | 抑制所有編譯警告 | 否 | false |
| `noStdlib` | 不將 Kotlin 標準函式庫包含到類別路徑中 | 否 | false |
| `failOnError` | 如果在編譯期間偵測到錯誤，則使建置失敗 | 否 | true |

### kotlinc 屬性

| 名稱 | 描述 | 必填 | 預設值 |
|------|-------------|----------|---------------|
| `output`  | 目標目錄或 .jar 檔案名稱 | 是 |  |
| `classpath`  | 編譯類別路徑 | 否 |  |
| `classpathref`  | 編譯類別路徑參考 | 否 |  |
| `includeRuntime`  | 如果 `output` 是 .jar 檔案，Kotlin 執行時函式庫是否包含在 jar 中 | 否 | true  |
| `moduleName` | 正在編譯的模組名稱 | 否 | 目標（如果指定）或專案的名稱 |

### kotlin2js 屬性

| 名稱 | 描述 | 必填 |
|------|-------------|----------|
| `output`  | 目標檔案 | 是 |
| `libraries`  | Kotlin 函式庫的路徑 | 否 |
| `outputPrefix`  | 用於產生 JavaScript 檔案的前綴 | 否 |
| `outputSuffix` | 用於產生 JavaScript 檔案的後綴 | 否 |
| `sourcemap`  | 是否應產生來源對應檔案 | 否 |
| `metaInfo`  | 是否應產生包含二進位描述符的中繼資料檔案 | 否 |
| `main`  | 編譯器產生的程式碼是否應呼叫 main 函式 | 否 |

### 傳遞原始編譯器引數

若要傳遞自訂的原始編譯器引數，您可以使用具有 `value` 或 `line` 屬性的 `<compilerarg>` 元素。這可以在 `<kotlinc>`、`<kotlin2js>` 和 `<withKotlin>` 任務元素中完成，如下所示：

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

運行 `kotlinc -help` 時，將顯示可使用的完整引數列表。