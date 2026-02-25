[//]: # (title: 编译并打包 Maven 项目)

您可以设置您的 Maven 项目以编译纯 Kotlin 或混合 Kotlin 与 Java 源代码，配置 Kotlin 编译器，指定编译器选项，并将您的应用程序打包为 JAR。

## 配置源代码编译

为了确保您的源代码被正确编译，请调整项目配置。您的 Maven 项目可以设置为编译[仅 Kotlin 源代码](#compile-kotlin-only-sources)或 [Kotlin 和 Java 源代码](#compile-kotlin-and-java-sources)的组合。

### 编译仅 Kotlin 源代码

要编译您的 Kotlin 源代码：

1. 在 `<build>` 部分指定源代码目录：

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. 确保应用了 Kotlin Maven 插件：

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

您可以将上述整个 `<executions>` 部分替换为 `<extensions>true</extensions>`。启用扩展程序会自动将 `compile`、`test-compile`、`kapt` 和 `test-kapt` 执行添加到您的构建中，并绑定到它们适当的[生命周期阶段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。如果您需要配置某次执行，则需要指定其 ID。您可以在下一节中找到相关示例。

> 如果多个构建插件重写了默认生命周期，并且您也启用了 `extensions` 选项，则 `<build>` 部分中的最后一个插件在生命周期设置方面具有优先级。所有早期对生命周期设置的更改都将被忽略。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 编译 Kotlin 和 Java 源代码

要编译同时包含 Kotlin 和 Java 源文件的项目，请确保 Kotlin 编译器在 Java 编译器之前运行。Java 编译器在 Kotlin 声明被编译为 `.class` 文件之前无法看到它们。如果您的 Java 代码使用了 Kotlin 类，为了避免 `cannot find symbol`（找不到符号）错误，必须先编译这些类。

Maven 根据两个主要因素确定插件执行顺序：

* `pom.xml` 文件中插件声明的顺序。
* 内置的默认执行，例如 `default-compile` 和 `default-testCompile`，无论它们在 `pom.xml` 文件中的位置如何，它们总是运行在用户定义的执行之前。

要控制执行顺序：

* 在 `maven-compiler-plugin` 之前声明 `kotlin-maven-plugin`。
* 禁用 Java 编译器插件的默认执行。
* 添加自定义执行以显式控制编译阶段。

> 您可以使用 Maven 中特殊的 `none` 阶段来禁用默认执行。
>
{style="note"}

您可以使用 `extensions` 简化混合 Kotlin/Java 编译的配置。它允许跳过 Maven 编译器插件的配置：

<tabs group="kotlin-java-maven">
<tab title="使用扩展程序" group-key="with-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin 编译器插件配置 -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
            <executions>
                <execution>
                    <id>default-compile</id>
                    <phase>compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- 确保 Kotlin 代码可以引用 Java 代码 -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>default-test-compile</id>
                    <phase>test-compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <!-- 使用扩展程序无需配置 Maven 编译器插件 -->
    </plugins>
</build>
```

如果您的项目之前是纯 Kotlin 配置，您还需要从 `<build>` 部分中删除以下行：

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

这可以确保在 `extensions` 设置下，Kotlin 代码可以引用 Java 代码，反之亦然。

</tab>
<tab title="不使用扩展程序" group-key="no-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin 编译器插件配置 -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>kotlin-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- 确保 Kotlin 代码可以引用 Java 代码 -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>kotlin-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <!-- Maven 编译器插件配置 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.14.0</version>
            <executions>
                <!-- 禁用默认执行 -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- 定义自定义执行 -->
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

</tab>
</tabs>

此配置确保：

* Kotlin 代码首先被编译。
* Java 代码在 Kotlin 之后编译，并且可以引用 Kotlin 类。
* Maven 的默认行为不会覆盖插件顺序。

有关 Maven 如何处理插件执行的更多详细信息，请参阅 Maven 官方文档中的[默认插件执行 ID 指南](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)。

## 配置 Kotlin 编译器

### 选择执行策略

_Kotlin 编译器执行策略_定义了 Kotlin 编译器的运行位置。有两种可用的策略：

| 策略 | Kotlin 编译器的执行位置 |
|-------------------------|---------------------------------------|
| Kotlin 守护进程 (默认) | 在其自身的守护进程内 |
| 进程内 (In process) | 在 Maven 进程内 |

默认情况下，使用 [Kotlin 守护进程](kotlin-daemon.md)。您可以通过在 `pom.xml` 文件中设置以下属性来切换到“进程内”策略：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

无论您使用哪种编译器执行策略，您仍然需要显式配置增量编译。

### 启用增量编译

为了使您的构建更快，您可以通过添加 `kotlin.compiler.incremental` 属性来启用增量编译：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 选项运行您的构建。

### 指定编译器选项

编译器的额外选项和参数可以在 Maven 插件节点的 `<configuration>` 部分中指定为元素：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果您想启用自动向构建中添加执行 -->
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

#### JVM 特有的属性

| 名称 | 属性名称 | 描述 | 可能的值 | 默认值 |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn` | | 不生成警告 | true, false | false |
| `languageVersion` | kotlin.compiler.languageVersion | 提供与指定 Kotlin 版本的源代码兼容性 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (实验性) | |
| `apiVersion` | kotlin.compiler.apiVersion | 仅允许使用来自指定版本的捆绑库的声明 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (实验性) | |
| `sourceDirs` | | 包含要编译的源文件的目录 | | 项目源根目录 |
| `compilerPlugins` | | 已启用的编译器插件 | | [] |
| `pluginOptions` | | 编译器插件的选项 | | [] |
| `args` | | 额外的编译器参数 | | [] |
| `jvmTarget` | `kotlin.compiler.jvmTarget` | 生成的 JVM 字节码的目标版本 | "1.8", "9", "10", ..., "25" | "%defaultJvmTargetVersion%" |
| `jdkHome` | `kotlin.compiler.jdkHome` | 将指定位置的自定义 JDK 包含到类路径中，而不是使用默认的 JAVA_HOME | | |

## 打包您的项目

### 创建 JAR 文件

要创建一个仅包含模块代码的小型 JAR 文件，请在 Maven `pom.xml` 文件的 `<build><plugins>` 下包含以下内容，其中 `main.class` 已定义为一个属性并指向 Kotlin 或 Java 的主类：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.5.0</version>
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

### 创建自包含的 JAR 文件

要创建一个包含模块代码及其依赖项的自包含 JAR 文件，请在 Maven `pom.xml` 文件的 `<build><plugins>` 下包含以下内容，其中 `main.class` 已定义为一个属性并指向 Kotlin 或 Java 的主类：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.8.0</version>
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

此自包含的 JAR 文件可以直接传递给 JRE 来运行您的应用程序：

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar