[//]: # (title: Maven)

Maven 是一种构建系统，可用于构建和管理任何基于 Java 的项目。

## 配置和启用插件

`kotlin-maven-plugin` 用于编译 Kotlin 源代码和模块。目前仅支持 Maven v3。

在你的 `pom.xml` 文件中，在 `kotlin.version` 属性中定义你想要使用的 Kotlin 版本：

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

要使用 JDK 17，请在你的 `.mvn/jvm.config` 文件中添加：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 声明版本库

默认情况下，`mavenCentral` 版本库对所有 Maven 项目都可用。要访问其他版本库中的构件，请在 `<repositories>` 元素中指定每个版本库的 ID 和 URL：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果你在 Gradle 项目中将 `mavenLocal()` 声明为版本库，那么在 Gradle 和 Maven 项目之间切换时，你可能会遇到问题。关于更多信息，请参见[声明版本库](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

## 设置依赖项

Kotlin 拥有一个丰富的标准库，可以在你的应用程序中使用。要在你的项目中包含该标准库，请将以下依赖项添加到你的 `pom.xml` 文件中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果你的目标平台是 JDK 7 或 8，并且 Kotlin 版本早于：
> * 1.8，则分别使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，则分别使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

如果你的项目使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)或测试功能，你需要添加相应的依赖项。反射库的构件 ID 为 `kotlin-reflect`，测试库的构件 ID 为 `kotlin-test` 和 `kotlin-test-junit`。

## 编译仅含 Kotlin 的源代码

要编译源代码，请在 `<build>` 标签中指定源目录：

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

Kotlin Maven 插件需要被引用才能编译源代码：

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

从 Kotlin 1.8.20 开始，你可以将上述整个 `<executions>` 元素替换为 `<extensions>true</extensions>`。启用扩展会自动将 `compile`、`test-compile`、`kapt` 和 `test-kapt` 执行项添加到你的构建中，并将它们绑定到其相应的[生命周期阶段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。如果你需要配置某个执行项，则需要指定其 ID。你可以在下一节中找到一个示例。

> 如果有多个构建插件覆盖了默认生命周期，并且你还启用了 `extensions` 选项，则 `<build>` 部分中的最后一个插件在生命周期设置方面具有优先级。所有较早的生命周期设置更改都将被忽略。
>
{style="note"}

[//]: # (title: 以下标题用于 Mari 链接服务。如果你希望在此处更改它，请同时更改那里的链接)

## 编译 Kotlin 和 Java 源代码

要编译包含 Kotlin 和 Java 源代码的项目，请在 Java 编译器之前调用 Kotlin 编译器。在 Maven 术语中，这意味着 `kotlin-maven-plugin` 应在 `maven-compiler-plugin` 之前运行，使用以下方法，确保 `kotlin` 插件在你的 `pom.xml` 文件中位于 `maven-compiler-plugin` 之前：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- You can set this option 
            to automatically take information about lifecycles -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- You can skip the <goals> element 
                        if you enable extensions for the plugin -->
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
                        <goal>test-compile</goal> <!-- You can skip the <goals> element 
                    if you enable extensions for the plugin -->
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

为了让你的构建更快，你可以通过添加 `kotlin.compiler.incremental` 属性来启用增量编译：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 选项运行你的构建。

## 配置注解处理

请参见[`kapt` – 在 Maven 中使用](kapt.md#use-in-maven)。

## 创建 JAR 文件

要创建一个仅包含模块代码的小型 JAR 文件，请在 Maven 的 `pom.xml` 文件的 `build->plugins` 下包含以下内容，其中 `main.class` 被定义为一个属性，并指向主要的 Kotlin 或 Java 类：

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

## 创建独立的 JAR 文件

要创建一个包含模块代码及其依赖项的独立 JAR 文件，请在 Maven 的 `pom.xml` 文件的 `build->plugins` 下包含以下内容，其中 `main.class` 被定义为一个属性，并指向主要的 Kotlin 或 Java 类：

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

这个独立的 JAR 文件可以直接传递给 JRE 以运行你的应用程序：

```bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 指定编译器选项

编译器的额外选项和实参可以作为标签在 Maven 插件节点的 `<configuration>` 元素下指定：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- If you want to enable automatic addition of executions to your build -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- Disable warnings -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- Enable strict mode for JSR-305 annotations -->
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

### JVM 特有的属性

| 名称              | 属性名                   | 描述                                                                          | 可能的值                                  | 默认值                      |
|-------------------|--------------------------|-------------------------------------------------------------------------------|-------------------------------------------|-----------------------------|
| `nowarn`          |                          | 不生成警告                                                                    | true, false                               | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 提供与指定 Kotlin 版本的源代码兼容性                                      | "1.8", "1.9", "2.0", "2.1", "2.2" (实验性的) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion | 仅允许使用指定版本的捆绑库中的声明                                          | "1.8", "1.9", "2.0", "2.1", "2.2" (实验性的) |                             |
| `sourceDirs`      |                          | 包含要编译的源文件的目录                                                      |                                           | 项目源代码根目录            |
| `compilerPlugins` |                          | 启用的编译器插件                                                              |                                           | []                          |
| `pluginOptions`   |                          | 编译器插件选项                                                                |                                           | []                          |
| `args`            |                          | 额外的编译器实参                                                              |                                           | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget` | 生成的 JVM 字节码的目标版本                                                   | "1.8", "9", "10", ..., "24"               | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome` | 将指定位置的自定义 JDK 包含到类路径中，而不是默认的 JAVA_HOME                 |                                           |                             |

## 使用 BOM

要使用 Kotlin [物料清单 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)，请编写一个对 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依赖项：

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

标准的 Javadoc 生成插件 (`maven-javadoc-plugin`) 不支持 Kotlin 代码。要为 Kotlin 项目生成文档，请使用 [Dokka](https://github.com/Kotlin/dokka)。Dokka 支持混合语言项目，并且可以生成多种格式的输出，包括标准的 Javadoc。有关如何在 Maven 项目中配置 Dokka 的更多信息，请参见 [Maven](dokka-maven.md)。

## 启用 OSGi 支持

[了解如何在 Maven 项目中启用 OSGi 支持](kotlin-osgi.md#maven)。