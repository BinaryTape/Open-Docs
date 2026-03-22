[//]: # (title: 配置 Maven 项目)

要使用 Maven 构建 Kotlin 项目，您需要将 Kotlin Maven 插件添加到 `pom.xml` 构建文件，声明仓库，并配置项目的依赖项。

## 启用并配置插件

`kotlin-maven-plugin` 用于编译 Kotlin 源代码和模块。目前仅支持 Maven v3。

要应用 Kotlin Maven 插件，请按以下方式更新您的 `pom.xml` 构建文件：

1. 在 `<properties>` 部分，在 `kotlin.version` 属性中定义您要使用的 Kotlin 版本：

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. 在 `<build><plugins>` 部分，添加 Kotlin Maven 插件：

   ```xml
   <build>
       <plugins>
           <plugin>
               <groupId>org.jetbrains.kotlin</groupId>
               <artifactId>kotlin-maven-plugin</artifactId>
               <version>${kotlin.version}</version>
           </plugin>
       </plugins>
   </build>
   ```

3. <p id="extension">(可选) 您还可以启用 <code>extensions</code> 选项以简化项目配置。为此，请更新 <code>pom.xml</code> 文件中的 Kotlin Maven 插件部分：</p>

   ```xml
   <plugins>
       <plugin>
           <groupId>org.jetbrains.kotlin</groupId>
           <artifactId>kotlin-maven-plugin</artifactId>
           <version>${kotlin.version}</version>
           <extensions>true</extensions> <!-- 添加此扩展 -->
       </plugin>
   </plugins>
   ```

   Kotlin Maven 插件中的 `extensions` 选项会自动：

   * 如果 `src/main/kotlin` 和 `src/test/kotlin` 目录已经存在但未在插件配置中指定，则将其注册为源根目录。
   * 如果项目中尚未定义 [`kotlin-stdlib` 依赖项](#dependency-on-the-standard-library)，则自动添加。

### 使用 JDK 17

要使用 JDK 17，请在您的 `.mvn/jvm.config` 文件中添加：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 声明仓库

默认情况下，`mavenCentral` 仓库对所有 Maven 项目都可用。要访问其他仓库中的构件，请在 `<repositories>` 部分中为仓库名称及其 URL 指定自定义 ID：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果您在 Gradle 项目中将 `mavenLocal()` 声明为仓库，那么在 Gradle 和 Maven 项目之间切换时可能会遇到问题。要了解更多信息，请参阅[声明仓库](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

## 设置依赖项

要添加对库的依赖，请将其包含在 `<dependencies>` 部分中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### 对标准库的依赖

Kotlin 拥有一个广泛的标准库，您可以在应用程序中使用。您可以手动添加标准库依赖项，也可以启用 [`extensions` 选项](#extension)以便在缺失时自动设置。

#### 手动配置

要手动将 Kotlin 标准库添加到项目中，请使用以下内容更新 `pom.xml` 文件中的 `dependencies` 部分：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- 使用在 <properties/> 中指定的 
            kotlin.version 属性： --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果您的目标是 JDK 7 或 8，且 Kotlin 版本低于：
> * 1.8，请分别使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，请分别使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

### 自动设置

使用 Kotlin Maven 插件提供的 [`extensions` 选项](#extension)可以避免手动配置。当您创建新的 Kotlin Maven 项目或将 Kotlin 引入现有的 Java Maven 项目时，如果项目中未定义 `kotlin-stdlib` 依赖项，它会自动添加。

您也可以选择不自动添加标准库。为此，请在 `<properties>` 部分中添加以下内容：

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

请注意，此属性会禁用所有简化设置功能，包括源根目录路径的注册。

### 对测试库的依赖

如果您的项目使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/)或测试框架，请添加相关的依赖项。使用 `kotlin-reflect` 作为反射库，并使用 `kotlin-test` 和 `kotlin-test-junit5` 作为测试库：

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

### 对 kotlinx 库的依赖

对于 kotlinx 库，您可以添加基本构件名称或带有 `-jvm` 后缀的名称。请参阅 [klibs.io](https://klibs.io/) 上的库 README 文件。

例如，要添加对 [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) 库的依赖：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

要添加对 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 库的依赖：

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

要使用 Kotlin [物料清单 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)，请添加对 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依赖：

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

## 下一步？

[编译并打包您的 Kotlin Maven 项目](maven-compile-package.md)