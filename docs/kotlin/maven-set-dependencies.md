[//]: # (title: 在 Maven 项目中设置仓库与依赖项)

对于您的 Kotlin Maven 项目，您可以配置 Maven 在默认的 Maven Central 仓库之外搜索构件的位置，并定义项目所依赖的库。

## 声明仓库 {id="declare-repositories"}

默认情况下，`mavenCentral` 仓库对所有 Maven 项目可用。要访问其他仓库中的构件，请在 `<repositories>` 部分为仓库名称及其 URL 指定自定义 ID：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果您在 Gradle 项目中将 `mavenLocal()` 声明为仓库，那么在 Gradle 和 Maven 项目之间切换时可能会遇到问题。有关详细信息，请参阅[声明仓库](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

通常，要添加对库的依赖项，您应该在 `<dependencies>` 部分声明一个新的 `<dependency>` 条目：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

## 设置依赖项 {id="set-dependencies"}

### 对标准库的依赖 {id="dependency-on-the-standard-library"}

Kotlin 拥有广泛的标准库，供您在应用程序中使用。您可以手动添加标准库依赖项，也可以启用 `<extensions>` 选项以便在缺失时自动设置。

#### 自动设置 {id="automatic-setup"}

您可以使用 Kotlin Maven 插件提供的 [`<extensions>` 选项](maven-configure-project.md#automatic-configuration)来避免手动配置。如果项目中未定义 `kotlin-stdlib` 依赖项，它会自动添加。例如，当您创建新的 Kotlin Maven 项目或在现有 Java Maven 项目中引入 Kotlin 时。

如果您已经声明了 `kotlin-stdlib` 依赖项（例如使用了不同的版本），带有 `<extensions>` 的 Kotlin Maven 插件将不会覆盖它。

您也可以选择退出标准库的自动添加。为此，请在 `<properties>` 部分添加以下内容：

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

> 此属性不仅会禁用标准库的自动添加，还会禁用源根路径的注册。其他 `<extensions>` 功能不受影响。
>
{style="note"}

#### 手动配置 {id="manual-configuration"}

要手动将 Kotlin 的标准库添加到您的项目，请使用以下内容更新 `pom.xml` 文件中的 `dependencies` 部分：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- 使用 <properties/> 中指定的 kotlin.version： --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果您的目标平台是 JDK 7 或 8，且使用的 Kotlin 版本早于：
> * 1.8，请分别使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，请分别使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

### 对测试库的依赖 {id="dependencies-on-test-libraries"}

如果您的项目使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/)或测试框架，请添加相关的依赖项。反射库使用 `kotlin-reflect`，测试库使用 `kotlin-test` 和 `kotlin-test-junit5`：

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

### 对 kotlinx 库的依赖 {id="dependency-on-a-kotlinx-library"}

对于 kotlinx 库，您可以添加基础构件名称，也可以添加带有 `-jvm` 后缀的名称。请参考 [klibs.io](https://klibs.io/) 上的库 README 文件。

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

## 使用 BOM 管理依赖项 {id="manage-dependencies-with-a-bom"}

[物料清单 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms) 是一种特殊的 POM 文件，用于管理项目中的依赖项版本。这可以保持相关构件的一致性并避免版本冲突。

Kotlin 发布了 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 构件，其中指定了与同一 Kotlin 版本对应的 Kotlin 库（如 `kotlin-stdlib`、`kotlin-reflect` 和 `kotlin-test`）的版本。当项目中的其他库对 Kotlin 构件有传递依赖时，这非常有用，因为它确保所有依赖项都解析为相同的 Kotlin 版本。

要使用 Kotlin BOM，请按如下方式将其导入 `pom.xml` 文件的 `<dependencyManagement>` 部分：

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

导入 BOM 后，您可以在 `<dependencies>` 部分声明 Kotlin 依赖项，而无需指定其版本；它们会自动从 BOM 文件中获取。

* 导入 BOM 本身不会向项目添加任何依赖项。它仅控制显式声明的依赖项和传递依赖项的版本。
* 如果您仍然为某个依赖项指定了 `<version>`，该值将覆盖 BOM 中的版本。

如果您的项目发布了多个一起发布的库，您可以提供自己的 BOM，以便用户能够以同样的方式统一这些库的版本。要了解如何编写自己的 BOM，请参阅 [Maven 文档](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)。

## 下一步？ {id="what-s-next"}

[配置 Kotlin 编译器](maven-kotlin-compiler.md)