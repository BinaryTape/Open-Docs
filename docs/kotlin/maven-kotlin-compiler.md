[//]: # (title: 为 Maven 项目配置 Kotlin 编译器)

`kotlin-maven-plugin` 允许您为 Maven 项目配置 Kotlin 编译器。
您可以指定编译器选项、选择执行策略并启用增量编译。

## 指定编译器选项

您可以在 Kotlin Maven 插件节点的 `<configuration>` 部分中，通过元素为编译器指定额外的选项和参数：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果您想在构建中启用自动添加 execution -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn> <!-- 禁用警告 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- 为 JSR-305 注解启用严格模式 -->
            ...
        </args>
    </configuration>
</plugin>
```

许多选项也可以通过属性进行配置：

```xml
<project>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支持以下属性：

### JVM 专属属性

| 名称 | 属性名称 | 描述 | 可能的值 | 默认值 |
|-------------------|-----------------------------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn`          |                                   | 不产生警告 | true, false                                             | false                       |
| `languageVersion` | `kotlin.compiler.languageVersion` | 提供与指定 Kotlin 版本的源代码兼容性 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (实验性) |                             |
| `apiVersion`      | `kotlin.compiler.apiVersion`      | 仅允许使用指定版本捆绑库中的声明 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (实验性) |                             |
| `sourceDirs`      |                                   | 包含要编译的源文件的目录 |                                                         | 项目源根目录 |
| `compilerPlugins` |                                   | 已启用的编译器插件 |                                                         | []                          |
| `pluginOptions`   |                                   | 编译器插件选项 |                                                         | []                          |
| `args`            |                                   | 额外的编译器参数 |                                                         | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`       | 生成的 JVM 字节码的目标版本 | "1.8", "9", "10", ..., "25"                             | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`         | 将指定位置的自定义 JDK 包含到类路径中，而不是默认的 JAVA_HOME |                                                         |                             |

## 选择执行策略

<snippet id="maven-configure-execution-strategy">

默认情况下，Maven 使用 Kotlin daemon 编译器执行策略。要切换到“进程内 (in process)”策略，请在 `pom.xml` 文件中设置以下属性：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

</snippet>

有关不同策略的更多信息，请参阅[编译器执行策略](compiler-execution-strategy.md)。

## 启用增量编译

为了加快构建速度，您可以通过添加 `kotlin.compiler.incremental` 属性来启用增量编译：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，在运行构建时使用 `-Dkotlin.compiler.incremental=true` 选项。

## 下一步

[打包您的项目](maven-compile-package.md)