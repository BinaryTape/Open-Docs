[//]: # (title: SAM-with-receiver 编译器插件)

*sam-with-receiver* 编译器插件将经注解的 Java "单一抽象方法" (SAM)
接口方法的第一个参数在 Kotlin 中变为一个接收者。此转换仅在 SAM 接口作为 Kotlin lambda 表达式传递时有效，
无论是对于 SAM 适配器还是 SAM 构造函数（更多详情请参见 [SAM 转换文档](java-interop.md#sam-conversions)）。

以下是一个示例：

```java
public @interface SamWithReceiver {}

@SamWithReceiver
public interface TaskRunner {
    void run(Task task);
}
```

```kotlin
fun test(context: TaskContext) {
    val runner = TaskRunner {
        // 此处 'this' 是 `Task` 的一个实例

        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

## Gradle

其用法与 [all-open](all-open-plugin.md) 和 [no-arg](no-arg-plugin.md) 相同，
不同之处在于 sam-with-receiver 没有内置预设，您需要指定自己的特殊处理注解列表。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.sam.with.receiver") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.sam.with.receiver" version "%kotlinVersion%"
}
```

</tab>
</tabs>

接下来指定 SAM-with-receiver 注解的列表：

```groovy
samWithReceiver {
    annotation("com.my.SamWithReceiver")
}
```

## Maven

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <plugin>sam-with-receiver</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>
                sam-with-receiver:annotation=com.my.SamWithReceiver
            </option>
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-sam-with-receiver</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

## 命令行编译器

将插件 JAR 文件添加到编译器插件类路径，并指定 sam-with-receiver 注解的列表：

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver