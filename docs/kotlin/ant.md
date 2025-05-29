[//]: # (title: Ant)

## 获取 Ant 任务

Kotlin 为 Ant 提供了三个任务：

*   `kotlinc`：针对 JVM 的 Kotlin 编译器
*   `kotlin2js`：针对 JavaScript 的 Kotlin 编译器
*   `withKotlin`：在使用标准 *javac* Ant 任务时编译 Kotlin 文件的任务

这些任务定义在 *kotlin-ant.jar* 库中，该库位于 [Kotlin 编译器](%kotlinLatestUrl%) 归档文件中的 `lib` 文件夹内。需要 Ant 1.8.2 及以上版本。

## 针对只有 Kotlin 源代码的 JVM

当项目只包含 Kotlin 源代码时，最简单的编译方法是使用 `kotlinc` 任务：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

其中 `${kotlin.lib}` 指向 Kotlin 独立编译器解压到的文件夹。

## 针对包含 Kotlin 源代码和多个根目录的 JVM

如果项目包含多个源根目录，请使用 `src` 作为元素来定义路径：

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

## 针对 Kotlin 和 Java 源代码的 JVM

如果项目同时包含 Kotlin 和 Java 源代码，虽然可以使用 `kotlinc`，但为了避免重复任务参数，建议使用 `withKotlin` 任务：

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

你也可以将要编译的模块名称指定为 `moduleName` 属性：

```xml
<withKotlin moduleName="myModule"/>
```

## 针对单源文件夹的 JavaScript

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## 针对带有前缀、后缀和 sourcemap 选项的 JavaScript

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 针对带 metaInfo 选项的单源文件夹 JavaScript

`metaInfo` 选项在您希望将编译结果作为 Kotlin/JavaScript 库分发时非常有用。如果 `metaInfo` 设置为 `true`，则在编译期间会创建一个包含二进制元数据的额外 JS 文件。此文件应与编译结果一起分发：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js 将被创建，其中包含二进制元数据 -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## 参考

完整的元素和属性列表如下：

### kotlinc 和 kotlin2js 的通用属性

| 名称 | 描述 | 必需 | 默认值 |
|------|-------------|----------|---------------|
| `src`  | 要编译的 Kotlin 源文件或目录 | 是 |  |
| `nowarn` | 抑制所有编译警告 | 否 | false |
| `noStdlib` | 不将 Kotlin 标准库包含到类路径中 | 否 | false |
| `failOnError` | 如果在编译期间检测到错误，则构建失败 | 否 | true |

### kotlinc 属性

| 名称 | 描述 | 必需 | 默认值 |
|------|-------------|----------|---------------|
| `output`  | 目标目录或 .jar 文件名 | 是 |  |
| `classpath`  | 编译类路径 | 否 |  |
| `classpathref`  | 编译类路径引用 | 否 |  |
| `includeRuntime`  | 如果 `output` 是 .jar 文件，是否将 Kotlin 运行时库包含在 jar 中 | 否 | true  |
| `moduleName` | 要编译的模块名称 | 否 | 目标的名称（如果指定）或项目名称 |

### kotlin2js 属性

| 名称 | 描述 | 必需 |
|------|-------------|----------|
| `output`  | 目标文件 | 是 |
| `libraries`  | Kotlin 库的路径 | 否 |
| `outputPrefix`  | 用于生成 JavaScript 文件的前缀 | 否 |
| `outputSuffix` | 用于生成 JavaScript 文件的后缀 | 否 |
| `sourcemap`  | 是否应生成 sourcemap 文件 | 否 |
| `metaInfo`  | 是否应生成包含二进制描述符的元数据文件 | 否 |
| `main`  | 编译器生成的代码是否应调用 main 函数 | 否 |

### 传递原始编译器参数

要传递自定义原始编译器参数，可以使用带有 `value` 或 `line` 属性的 `<compilerarg>` 元素。这可以在 `<kotlinc>`、`<kotlin2js>` 和 `<withKotlin>` 任务元素中完成，如下所示：

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

运行 `kotlinc -help` 时会显示可使用的完整参数列表。