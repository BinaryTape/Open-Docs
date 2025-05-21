---
title: "带有接收器的 SAM 转换编译器插件"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*sam-with-receiver* 编译器插件使带注解的 Java “单抽象方法”（SAM）接口方法的第一个参数成为 Kotlin 中的接收者（receiver）。只有当 SAM 接口作为 Kotlin lambda 传递时，此转换才有效，SAM 适配器和 SAM 构造函数均可（有关更多详细信息，请参见 [SAM 转换文档](java-interop#sam-conversions)）。

这是一个例子：

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
        // Here 'this' is an instance of 'Task'

        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

## Gradle

用法与 [all-open](all-open-plugin) 和 [no-arg](no-arg-plugin) 相同，除了 sam-with-receiver 没有任何内置预设，你需要指定自己的特殊处理注解列表。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.sam.with.receiver") version "2.1.20"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.sam.with.receiver" version "2.1.20"
}
```

</TabItem>
</Tabs>

然后指定 SAM-with-receiver 注解的列表：

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

## 命令行编译器 (Command-line compiler)

将插件 JAR 文件添加到编译器插件类路径，并指定 sam-with-receiver 注解的列表：

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```