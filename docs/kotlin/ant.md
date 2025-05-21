---
title: Ant
---
## 获取 Ant 任务

Kotlin 为 Ant 提供了三个任务：

* `kotlinc`: 面向 JVM 的 Kotlin 编译器
* `kotlin2js`: 面向 JavaScript 的 Kotlin 编译器
* `withKotlin`: 在使用标准 *javac* Ant 任务时编译 Kotlin 文件的任务

这些任务定义在 *kotlin-ant.jar* 库中，该库位于 [Kotlin 编译器](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) 压缩包的 `lib` 文件夹中。 需要 Ant 1.8.2+ 版本。

## 使用纯 Kotlin 源码面向 JVM

当项目完全由 Kotlin 源代码组成时，编译项目最简单的方法是使用 `kotlinc` 任务：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

其中 `${kotlin.lib}` 指向解压 Kotlin 独立编译器的文件夹。

## 使用纯 Kotlin 源码和多个根目录面向 JVM

如果项目由多个源码根目录组成，请使用 `src` 作为元素来定义路径：

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

## 使用 Kotlin 和 Java 源码面向 JVM

如果一个项目同时包含 Kotlin 和 Java 源代码，虽然可以使用 `kotlinc`，但为了避免重复任务参数，建议使用 `withKotlin` 任务：

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

您还可以将正在编译的模块名称指定为 `moduleName` 属性：

```xml
<withKotlin moduleName="myModule"/>
```

## 使用单个源文件夹面向 JavaScript

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

## 使用 Prefix、PostFix 和 sourcemap 选项面向 JavaScript

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

## 使用单个源文件夹和 metaInfo 选项面向 JavaScript

如果希望将转换结果作为 Kotlin/JavaScript 库分发，则 `metaInfo` 选项非常有用。如果 `metaInfo` 设置为 `true`，则在编译期间将创建包含二进制元数据的附加 JS 文件。该文件应与翻译结果一起分发：

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- out.meta.js will be created, which contains binary metadata -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

## 参考

元素的完整列表和属性如下所示：

### kotlinc 和 kotlin2js 的通用属性

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `src`  | 要编译的 Kotlin 源文件或目录 | Yes |  |
| `nowarn` | 阻止所有编译警告 | No | false |
| `noStdlib` | 不将 Kotlin 标准库包含到类路径中 | No | false |
| `failOnError` | 如果在编译期间检测到错误，则构建失败 | No | true |

### kotlinc 属性

| Name | Description | Required | Default Value |
|------|-------------|----------|---------------|
| `output`  | 目标目录或 .jar 文件名 | Yes |  |
| `classpath`  | 编译类路径 | No |  |
| `classpathref`  | 编译类路径引用 | No |  |
| `includeRuntime`  | 如果 `output` 是 .jar 文件，是否将 Kotlin 运行时库包含在 jar 中 | No | true  |
| `moduleName` | 正在编译的模块的名称 | No | 目标的名称（如果指定）或项目 |

### kotlin2js 属性

| Name | Description | Required |
|------|-------------|----------|
| `output`  | 目标文件 | Yes |
| `libraries`  | Kotlin 库的路径 | No |
| `outputPrefix`  | 用于生成的 JavaScript 文件的前缀 | No |
| `outputSuffix` | 用于生成的 JavaScript 文件的后缀 | No |
| `sourcemap`  | 是否应生成 sourcemap 文件 | No |
| `metaInfo`  | 是否应生成带有二进制描述符的元数据文件 | No |
| `main`  | 编译器生成的代码是否应调用 main 函数 | No |

### 传递原始编译器参数

要传递自定义的原始编译器参数，可以使用带有 `value` 或 `line` 属性的 `<compilerarg>` 元素。 这可以在 `<kotlinc>`、`<kotlin2js>` 和 `<withKotlin>` 任务元素中完成，如下所示：

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

当您运行 `kotlinc -help` 时，会显示可以使用的完整参数列表。