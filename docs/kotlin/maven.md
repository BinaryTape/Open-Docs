[//]: # (title: Maven)

Maven 是一个构建系统，你可以用它来构建和管理任何基于 Java 的项目。

## 配置并启用插件

`kotlin-maven-plugin` 用于编译 Kotlin 源代码和模块。目前，仅支持 Maven v3。

在你的 `pom.xml` 文件中，通过 `kotlin.version` 属性定义你想使用的 Kotlin 版本：

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

要启用 `kotlin-maven-plugin`，请更新你的 `pom.xml` 文件：

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

要在 `.mvn/jvm.config` 文件中使用 JDK 17，请添加：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 声明仓库

默认情况下，`mavenCentral` 仓库对所有 Maven 项目都可用。要访问其他仓库中的构件 (artifacts)，请在 `<repositories>` 元素中指定每个仓库的 ID 和 URL：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果你在 Gradle 项目中将 `mavenLocal()` 声明为仓库，那么在 Gradle 和 Maven 项目之间切换时可能会遇到问题。有关更多信息，请参阅 [声明仓库](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

## 设置依赖

Kotlin 拥有一个广泛的标准库，可用于你的应用程序。要在你的项目中使用标准库，请将以下依赖添加到 `pom.xml` 文件中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果你使用低于 1.8 版本的 Kotlin 且目标是 JDK 7 或 8，请分别使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> 如果你使用低于 1.2 版本的 Kotlin 且目标是 JDK 7 或 8，请分别使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

如果你的项目使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)或测试工具，你还需要添加相应的依赖。反射库的构件 ID 是 `kotlin-reflect`，测试库的构件 ID 是 `kotlin-test` 和 `kotlin-test-junit`。

## 编译纯 Kotlin 源代码

要编译源代码，请在 `<build>` 标签中指定源目录：

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

编译源代码需要引用 Kotlin Maven 插件：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>

            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>

                <execution>
                    <id>test-compile</id>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

从 Kotlin 1.8.20 开始，你可以用 `<extensions>true</extensions>` 替换上面的整个 `<executions>` 元素。启用扩展会自动将 `compile`、`test-compile`、`kapt` 和 `test-kapt` 执行添加到你的构建中，并绑定到其适当的[生命周期阶段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。如果你需要配置某个执行，则需要指定其 ID。你可以在下一节中找到一个示例。

> 如果有多个构建插件覆盖了默认生命周期，并且你也启用了 `extensions` 选项，那么 `<build>` 部分中最后一个插件在生命周期设置方面具有优先权。所有先前的生命周期设置更改都将被忽略。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## 编译 Kotlin 和 Java 源代码

要编译包含 Kotlin 和 Java 源代码的项目，请在 Java 编译器之前调用 Kotlin 编译器。在 Maven 中，这意味着 `kotlin-maven-plugin` 应该在 `maven-compiler-plugin` 之前运行，方法是确保 `kotlin` 插件在 `pom.xml` 文件中位于 `maven-compiler-plugin` 之前：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- 你可以设置此选项 
            以自动获取有关生命周期的信息 -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- 如果你为插件启用扩展，则可以跳过 <goals> 元素 -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals> 
                        <goal>test-compile</goal> <!-- 如果你为插件启用扩展，则可以跳过 <goals> 元素 -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.5.1</version>
            <executions>
                <!-- Replacing default-compile as it is treated specially by Maven -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- Replacing default-testCompile as it is treated specially by Maven -->
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>java-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 启用增量编译

为了加快构建速度，你可以通过添加 `kotlin.compiler.incremental` 属性来启用增量编译：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 选项运行你的构建。

## 配置注解处理

请参阅 [`kapt` – 在 Maven 中使用](kapt.md#use-in-maven)。

## 创建 JAR 文件

要创建一个只包含模块代码的小型 JAR 文件，请在你的 Maven `pom.xml` 文件中 `build->plugins` 下包含以下内容，其中 `main.class` 被定义为一个属性，并指向主要的 Kotlin 或 Java 类：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.6</version>
    <configuration>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>${main.class}</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## 创建自包含 JAR 文件

要创建一个包含模块代码及其依赖的自包含 JAR 文件，请在你的 Maven `pom.xml` 文件中 `build->plugins` 下包含以下内容，其中 `main.class` 被定义为一个属性，并指向主要的 Kotlin 或 Java 类：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>2.6</version>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals> <goal>single</goal> </goals>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>${main.class}</mainClass>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

这个自包含 JAR 文件可以直接传递给 JRE 来运行你的应用程序：

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 指定编译器选项

编译器的附加选项和参数可以在 Maven 插件节点中的 `<configuration>` 元素下指定为标签：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果你想启用自动将执行添加到你的构建中 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 禁用警告 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- 为 JSR-305 注解启用严格模式 -->
            ...
        </args>
    </configuration>
</plugin>
```

许多选项也可以通过属性进行配置：

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支持以下属性：

### JVM 特有属性

| 名称              | 属性名                   | 描述                                                                                          | 可能的值                                 | 默认值               |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 不生成警告                                                                                 | true, false                                      | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 提供与指定 Kotlin 版本的源兼容性                                    | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | 允许仅使用指定版本的捆绑库中的声明                        | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | 包含要编译的源文件的目录                                               |                                                  | 项目的源根目录    |
| `compilerPlugins` |                                 | 启用的编译器插件                                                                             |                                                  | []                          |
| `pluginOptions`   |                                 | 编译器插件的选项                                                                         |                                                  | []                          |
| `args`            |                                 | 附加编译器参数                                                                        |                                                  | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 生成的 JVM 字节码的目标版本                                                         | "1.8", "9", "10", ..., "23"                      | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | 将指定位置的自定义 JDK 包含到 classpath 中，而不是默认的 JAVA_HOME |                                                  |                             |

## 使用 BOM

要使用 Kotlin [物料清单 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)，请编写对 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依赖：

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

## 生成文档

标准的 Javadoc 生成插件 (`maven-javadoc-plugin`) 不支持 Kotlin 代码。要为 Kotlin 项目生成文档，请使用 [Dokka](https://github.com/Kotlin/dokka)。Dokka 支持混合语言项目，并可以生成多种格式的输出，包括标准 Javadoc。有关如何在 Maven 项目中配置 Dokka 的更多信息，请参阅 [Maven](dokka-maven.md)。

## 启用 OSGi 支持

[了解如何在 Maven 项目中启用 OSGi 支持](kotlin-osgi.md#maven)。