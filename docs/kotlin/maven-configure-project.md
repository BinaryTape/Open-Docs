[//]: # (title: 配置 Maven 项目)

当您将 Kotlin 引入现有的 Java Maven 项目或创建一个新的 Kotlin Maven 项目时，您需要添加用于编译 Kotlin 源代码和模块的 Kotlin Maven 插件。

目前仅支持 Maven v3。

## 自动配置

在 Java-Kotlin 混合项目和纯 Kotlin 项目中，您都可以使用 `<extensions>` 扩展程序选项来简化 Maven 配置。这种方法可以节省您的时间，因为您不需要配置 Maven 编译器插件。

要应用带有 `<extensions>` 的 Kotlin Maven 插件，请按以下方式更新您的 `pom.xml` 构建文件：

1. 在 `<properties>` 部分，在 `kotlin.version` 属性中定义您要使用的 Kotlin 版本：

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. 在 `<build><plugins>` 部分，添加启用了 `<extensions>` 选项的 Kotlin Maven 插件：

   ```xml
   <build>
       <plugins>
           <!-- Kotlin 编译器插件配置 -->
           <plugin>
               <groupId>org.jetbrains.kotlin</groupId>
               <artifactId>kotlin-maven-plugin</artifactId>
               <version>${kotlin.version}</version>
               <extensions>true</extensions> <!-- 启用扩展程序 -->
           </plugin>
           <!-- 使用 extensions 后无需配置 Maven 编译器插件 -->
       </plugins>
   </build>
   ```

`<extensions>` 选项会：

* 如果 `src/main/kotlin` 和 `src/test/kotlin` 目录已经存在但未在插件配置中指定，则将其注册为源根目录。
* 如果项目中尚未定义 [`kotlin-stdlib` 依赖项](maven-set-dependencies.md#dependency-on-the-standard-library)，则自动添加。
* 将 `compile`、`test-compile`、`kapt` 和 `test-kapt` 执行添加到您的构建中，并绑定到相应的[生命周期阶段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。因此，您无需手动设置带有 `<id>` 和 `<goals>` 的 `<executions>` 部分。
   
如果您拥有一个 Java 与 Kotlin 混合项目，该配置可确保：

* Kotlin 代码首先进行编译。
* Java 代码在 Kotlin 之后编译，并可以引用 Kotlin 类。
* 默认的 Maven 行为不会覆盖插件顺序。

扩展程序配置会替换整个 `<executions>` 部分。如果您需要配置特定的执行，请参阅[编译 Kotlin 和 Java 源代码](#compile-kotlin-and-java-sources)中的示例。

> 如果有多个构建插件覆盖了默认生命周期，并且您还启用了 `<extensions>` 选项，则 `<build>` 部分中的最后一个插件在生命周期设置方面具有优先级。所有较早的生命周期设置更改都将被忽略。
>
{style="note"}

### 更改 Maven 编译器版本

目前，与 `<extensions>` 配合使用的 Maven 编译器插件的默认版本为 **%mavenExtensionsVersion%**。您可以单独设置不同的版本：

```xml
<build>
    <plugins>
        <!-- Kotlin 编译器插件配置 -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
        <!-- 针对 Java 类的 Maven 编译器插件配置 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>%mavenPluginVersion%</version>
        </plugin>
    </plugins>
</build>
```

## 手动配置

如果不启用 Kotlin Maven 插件中的 `<extensions>`，您需要手动配置项目以确保源代码正确编译。

您可以将 Maven 项目设置为编译 [Java 与 Kotlin 混合源代码](#compile-kotlin-and-java-sources)或[仅编译 Kotlin 源代码](#compile-kotlin-only-sources)。

### 编译 Kotlin 和 Java 源代码

要编译同时包含 Kotlin 和 Java 源文件的项目，请确保 Kotlin 编译器在 Java 编译器之前运行。

Java 编译器在 Kotlin 代码被编译为 `.class` 文件之前无法看到 Kotlin 声明。如果您的 Java 代码使用了 Kotlin 类，则必须先编译这些类以避免“找不到符号” (cannot find symbol) 错误。

Maven 根据两个主要因素确定插件执行顺序：

* `pom.xml` 文件中插件声明的顺序。
* 内置的默认执行，例如 `default-compile` 和 `default-testCompile`，无论它们在 `pom.xml` 文件中的位置如何，它们始终在用户定义的执行之前运行。

要控制执行顺序：

* 在 `maven-compiler-plugin` 之前声明 `kotlin-maven-plugin`。
* 禁用 Java 编译器插件的默认执行。
* 添加自定义执行以显式控制编译阶段。

> 您可以使用 Maven 中特殊的 `none` 阶段来禁用默认执行。
>
{style="note"}

要应用 Kotlin Maven 插件，请按以下方式更新您的 `pom.xml` 构建文件：

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
            <version>3.15.0</version>
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

该配置可确保：

* Kotlin 代码首先进行编译。
* Java 代码在 Kotlin 之后编译，并可以引用 Kotlin 类。
* 默认的 Maven 行为不会覆盖插件顺序。

有关 Maven 如何处理插件执行的更多详细信息，请参阅 Maven 官方文档中的[默认插件执行 ID 指南](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)。

### 仅编译 Kotlin 源代码

要编译仅包含 Kotlin 源文件的项目，请声明源根目录并配置 Kotlin Maven 插件：

1. 在 `<build>` 部分中指定源目录：

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

### 使用 JDK 17

要在使用 JDK 17 时，在您的 `.mvn/jvm.config` 文件中添加：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 下一步？

[设置您的 Kotlin Maven 项目的依赖项](maven-set-dependencies.md)