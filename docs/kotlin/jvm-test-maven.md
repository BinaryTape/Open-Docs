[//]: # (title: 使用 Maven 测试 Kotlin 项目)

Kotlin 与 Maven 生态系统无缝集成，允许您使用行业标准工具验证后端应用程序。在本指南中，您将学习如何使用 JUnit 创建测试，并使用 Maven 插件运行单元测试和集成测试。

> 有关设置 Maven 项目以同时使用 Kotlin 和 Java 的详细指南，请参阅 [](mixing-java-kotlin-intellij.md#project-configuration)。
> 
{style="tip"}

## 使用 JUnit 创建测试

[JUnit](https://junit.org/) 是 Kotlin 后端开发的标准测试框架。虽然 Kotlin 支持多个 JUnit 版本，但大多数现代项目应使用 JUnit 6。

要使用 JUnit 在 Kotlin 中创建测试，请使用来自 `kotlin.test` 或 JUnit 软件包的 `@Test` 注解。

### 添加依赖项

使用 `kotlin-test` 库是最简单的入门方式。它提供了一组通用的断言，并会自动拉取必要的 JUnit 构件。

#### JUnit 5 及更高版本

对于所有新项目，请使用 `kotlin-test-junit5` 构件。它为 JUnit 提供完整支持，包括嵌套测试和并行执行等功能。Kotlin/JVM 支持最新的稳定 JUnit 版本，即 JUnit 6。

按如下方式更新您的 `pom.xml` 文件：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <version>%kotlinVersion%</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

> 尽管其名称如此，`kotlin-test-junit5` 仍支持所有最新的 JUnit 版本，包括 JUnit 6。
>
{style="note"}

#### JUnit 4

如果您想使用较早版本的 JUnit（例如用于旧版项目），请使用利用 JUnit 4 的 `kotlin-test-junit` 构件：

```xml
<!-- pom.xml -->
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit</artifactId>
        <version>%kotlinVersion%</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

> 有关使用 JUnit 进行测试的详细指南和示例项目，请参阅[使用 Kotlin 测试 Java 代码](jvm-test-using-junit.md)教程。
>
{style="tip"}

### 编写单元测试

单元测试验证代码的隔离部分，例如单个函数或类。
按照约定，单元测试以 `*Test` 后缀命名。例如：

```kotlin
import kotlin.test.Test
import kotlin.test.assertEquals

class OrderServiceTest {
    @Test
    fun `calculate total should sum item prices`() {
        val service = OrderService()
        val result = service.calculateTotal(listOf(10.0, 25.0))
        assertEquals(35.0, result)
    }
}
```

### 编写集成测试

集成测试验证组件之间的交互，例如服务与数据库。
按照约定，集成测试以 `*IT` 后缀命名。例如：

```kotlin
import kotlin.test.Test
import kotlin.test.assertNotNull

class UserRepositoryIT {
    @Test
    fun saveFindUser() {
        // 示例：与数据库或服务的集成
        val repository = UserRepository()
        repository.save(User("KotlinUser"))
        
        val user = repository.findByName("KotlinUser")
        assertNotNull(user)
    }
}
```

## 运行测试

在 Maven 项目中，测试执行通常分配给两个插件：Surefire 和 Failsafe，以确保整洁的构建生命周期。

### 使用 Surefire 插件

[Surefire 插件](https://maven.apache.org/surefire/maven-surefire-plugin/)处理 _单元测试_。
它运行所有遵循 `*Test` 命名模式的 Kotlin 和 Java 测试。

默认情况下，它在构建生命周期的 `test` 阶段执行，如果测试失败，则会立即导致构建失败。

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.5.5</version>
</plugin>
```

要仅运行单元测试，请使用以下命令：

```bash
mvn test
```

### 使用 Failsafe 插件

[Failsafe 插件](https://maven.apache.org/surefire/maven-failsafe-plugin/)处理 _集成测试_。
它运行所有遵循 `*IT` 命名模式的 Kotlin 和 Java 测试。

与 Surefire 不同，Failsafe 允许构建在 `integration-test` 阶段即使有测试失败也继续进行，从而允许 `post-integration-test` 阶段的任务（如停止 Docker 容器）运行。
如果有任何测试失败，构建最终会在 `verify` 阶段失败。

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <version>3.5.5</version>
    <executions>
        <execution>
            <goals>
                <goal>integration-test</goal>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

要同时运行单元测试和集成测试，请使用以下命令：

```bash
mvn verify
```

## 探索其他测试框架

除 JUnit 外，您还可以使用其他流行框架使 Kotlin 测试更加惯用且易读：

| 库 | 描述 |
|-------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| [AssertJ](https://github.com/assertj/assertj)               | 具有可链式调用断言的流式断言库。 |
| [Mockito-Kotlin](https://github.com/mockito/mockito-kotlin) | Mockito 的 Kotlin 包装器，提供辅助函数并能更好地与 Kotlin 类型系统集成。 |
| [MockK](https://github.com/mockk/mockk)                     | 原生 Kotlin 模拟库，支持 Kotlin 特定功能，包括协程和扩展函数。 |
| [Kotest](https://github.com/kotest/kotest)                  | Kotlin 断言库，提供多种断言样式和广泛的匹配器支持。 |
| [Strikt](https://github.com/robfletcher/strikt)             | Kotlin 断言库，具有类型安全断言并支持数据类。 |

## 后续步骤

* 探索 [`kotlin.test` 库](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/)的功能。
* 使用 [Kotlin 的 Power-assert 编译器插件](power-assert.md)改进您的测试输出。