[//]: # (title: 配置 Maven 项目)

要使用 Maven 构建 Kotlin 项目，你需要将 Kotlin Maven 插件添加到你的 `pom.xml` 构建文件，声明仓库，并配置项目的依赖项。

## 启用并配置插件

`kotlin-maven-plugin` 会编译 Kotlin 源代码和模块。目前，仅支持 Maven v3。

要应用 Kotlin Maven 插件，请如下更新你的 `pom.xml` 构建文件：

1. 在 `<properties>` 部分，在 `kotlin.version` 属性中定义你想使用的 Kotlin 版本：

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. 在 `<build><plugins>` 部分，添加 Kotlin Maven 插件：

   ```xml
   <plugins>
       <plugin>
           <artifactId>kotlin-maven-plugin</artifactId>
           <groupId>org.jetbrains.kotlin</groupId>
           <version>%kotlinVersion%</version>
       </plugin>
   </plugins>
   ```

### 使用 JDK 17

要使用 JDK 17，请在你的 `.mvn/jvm.config` 文件中添加：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 声明仓库

默认情况下，`mavenCentral` 仓库对所有 Maven 项目都可用。要访问其他仓库中的构件，请在 `<repositories>` 部分为仓库名称及其 URL 指定一个自定义 ID：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果你在 Gradle 项目中将 `mavenLocal()` 声明为一个仓库，那么在 Gradle 和 Maven 项目之间切换时可能会遇到问题。关于更多信息，请参见 [声明仓库](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

## 设置依赖项

要添加一个库的依赖项，请将其包含在 `<dependencies>` 部分中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### 标准库依赖项

Kotlin 有一个广泛的标准库，你可以在你的应用程序中使用它。要在你的项目中使用标准库，请将以下依赖项添加到你的 `pom.xml` 文件中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- Uses the kotlin.version property 
            specified in <properties/>: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果你以 JDK 7 或 8 为目标平台，且 Kotlin 版本早于：
> * 1.8，请分别使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，请分别使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

### 测试库依赖项

如果你的项目使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/) 或测试框架，请添加相关的依赖项。`kotlin-reflect` 用于反射库，`kotlin-test` 和 `kotlin-test-junit5` 用于测试库：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### kotlinx 库依赖项

对于 kotlinx 库，你可以添加基础构件名称或带有 `-jvm` 后缀的名称。请参考 [klibs.io](https://klibs.io/) 上该库的 README 文件。

例如，要添加对 [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) 库的依赖项：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

要添加对 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 库的依赖项：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

### 使用 BOM 依赖机制

要使用 Kotlin [物料清单 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)，请添加对 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依赖项：

```xml
<dependencyManagement>
    <dependencies>  
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-bom</artifactId>
            <version>%kotlinVersion%</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 接下来是什么？

[编译并打包你的 Kotlin Maven 项目](maven-compile-package.md)