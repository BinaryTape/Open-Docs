[//]: # (title: 编译和打包 Maven 项目)

你可以配置你的 Maven 项目来编译纯 Kotlin 源码或 Kotlin 与 Java 混合源码，配置 Kotlin 编译器，指定编译器选项，并将你的应用程序打包成 JAR 文件。

## 配置源码编译

为确保源码正确编译，请调整项目配置。你的 Maven 项目可以配置为编译 [纯 Kotlin 源码](#compile-kotlin-only-sources) 或 [Kotlin 与 Java 混合源码](#compile-kotlin-and-java-sources)。

### 编译纯 Kotlin 源码

要编译你的 Kotlin 源码：

1.  在 `<build>` 部分指定源码目录：

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2.  确保应用了 Kotlin Maven 插件：

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

你可以将上面的整个 `<executions>` 部分替换为 `<extensions>true</extensions>`。启用扩展会自动将 `compile`、`test-compile`、`kapt` 和 `test-kapt` 执行添加到你的构建中，并绑定到其对应的 [生命周期阶段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。如果你需要配置某个执行，则需要指定其 ID。你可以在下一节中找到相关示例。

> 如果多个构建插件覆盖了默认生命周期，并且你也启用了 `extensions` 选项，那么 `<build>` 部分中最后一个插件在生命周期设置方面具有优先级。所有早期对生命周期设置的更改都将被忽略。
>
{style="note"}

<!-- 以下标题用于 Mari 链接服务。如果在此处更改，请同时更改那里的链接 -->

### 编译 Kotlin 与 Java 混合源码

要编译一个同时包含 Kotlin 和 Java 源码文件的项目，请确保 Kotlin 编译器在 Java 编译器之前运行。Java 编译器在 Kotlin 声明被编译成 `.class` 文件之前无法看到它们。如果你的 Java 代码使用了 Kotlin 类，则必须先编译这些类，以避免 `cannot find symbol` 错误。

Maven 根据两个主要因素确定插件执行顺序：

*   `pom.xml` 文件中插件声明的顺序。
*   内置的默认执行，例如 `default-compile` 和 `default-testCompile`，无论它们在 `pom.xml` 文件中的位置如何，始终在用户定义的执行之前运行。

要控制执行顺序：

*   在 `maven-compiler-plugin` 之前声明 `kotlin-maven-plugin`。
*   禁用 Java 编译器插件的默认执行。
*   添加自定义执行以显式控制编译阶段。

> 你可以在 Maven 中使用特殊的 `none` 阶段来禁用默认执行。
>
{style="note"}

你可以使用 `extensions` 来简化 Kotlin/Java 混合编译的配置。它允许跳过 Maven 编译器插件配置：

<tabs group="kotlin-java-maven">
<tab title="使用 extensions" group-key="with-extensions">

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
        <!-- 使用 extensions 无需配置 Maven 编译器插件 -->
    </plugins>
</build>
```

如果你的项目之前是纯 Kotlin 配置，你还需要从 `<build>` 部分移除以下几行：

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

通过 `extensions` 设置，这可确保 Kotlin 代码可以引用 Java 代码，反之亦然。

</tab>
<tab title="不使用 extensions" group-key="no-extensions">

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

此配置可确保：

*   Kotlin 代码优先编译。
*   Java 代码在 Kotlin 之后编译，并且可以引用 Kotlin 类。
*   Maven 的默认行为不会覆盖插件顺序。

关于 Maven 如何处理插件执行的更多详情，请参见 Maven 官方文档中的 [默认插件执行 ID 指南](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)。

## 配置 Kotlin 编译器

### 选择执行策略

_Kotlin 编译器执行策略_ 定义了 Kotlin 编译器的运行位置。有两种可用策略：

| 策略                | Kotlin 编译器执行位置 |
|---------------------|-----------------------|
| Kotlin daemon (默认) | 在其自己的 daemon 进程内 |
| In process          | 在 Maven 进程内       |

默认情况下，使用 [Kotlin daemon](kotlin-daemon.md)。你可以通过在 `pom.xml` 文件中设置以下属性来切换到“进程内”策略：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

无论你使用何种编译器执行策略，仍然需要显式配置增量编译。

### 启用增量编译

为了加快构建速度，你可以通过添加 `kotlin.compiler.incremental` 属性来启用增量编译：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 选项运行你的构建。

### 指定编译器选项

编译器的额外选项和实参可以在 Maven 插件节点的 `<configuration>` 部分中指定为元素：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果你想自动添加执行到你的构建中 -->
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

| 名称              | 属性名                       | 描述                                                                                          | 可能值                                         | 默认值                  |
|-------------------|-----------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------|-------------------------|
| `nowarn`          |                             | 生成无警告                                                                                    | true, false                                    | false                   |
| `languageVersion` | kotlin.compiler.languageVersion | 提供与指定 Kotlin 版本的源码兼容性                                                            | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL) |                         |
| `apiVersion`      | kotlin.compiler.apiVersion    | 允许仅使用指定版本的捆绑库中的声明                                                            | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (EXPERIMENTAL) |                         |
| `sourceDirs`      |                             | 包含要编译的源码文件的目录                                                                    |                                                | 项目源码根目录            |
| `compilerPlugins` |                             | 已启用的编译器插件                                                                            |                                                | []                      |
| `pluginOptions`   |                             | 编译器插件选项                                                                                |                                                | []                      |
| `args`            |                             | 额外的编译器实参                                                                              |                                                | []                      |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`   | 生成 JVM 字节码的目标版本                                                                     | "1.8", "9", "10", ..., "25"                    | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`     | 将指定位置的自定义 JDK 包含到 classpath 中，而不是默认的 JAVA_HOME                         |                                                |                         |

## 打包你的项目

### 创建 JAR 文件

要创建一个只包含模块代码的小型 JAR 文件，请将以下内容包含在 Maven `pom.xml` 文件的 `<build><plugins>` 下，其中 `main.class` 被定义为一个属性，并指向主要的 Kotlin 或 Java 类：

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

### 创建独立 JAR 文件

要创建一个包含模块代码及其所有依赖项的独立 JAR 文件，请将以下内容包含在 Maven `pom.xml` 文件的 `<build><plugins>` 下，其中 `main.class` 被定义为一个属性，并指向主要的 Kotlin 或 Java 类：

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

这个独立 JAR 文件可以直接传递给 JRE 来运行你的应用程序：

```bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar