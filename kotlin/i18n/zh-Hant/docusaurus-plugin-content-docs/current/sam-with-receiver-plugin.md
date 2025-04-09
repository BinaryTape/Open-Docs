---
title: "具有接收者的 SAM 編譯器外掛程式 (SAM-with-receiver compiler plugin)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

*sam-with-receiver* 編譯器外掛程式使帶有註解的 Java「單一抽象方法」(Single Abstract Method, SAM) 介面方法的第一個參數在 Kotlin 中成為接收器 (receiver)。 這種轉換僅在 SAM 介面作為 Kotlin lambda 傳遞時才有效，適用於 SAM 适配器和 SAM 構造函數（更多詳細資訊，請參閱 [SAM 轉換文檔](java-interop#sam-conversions)）。

以下是一個範例：

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

其用法與 [all-open](all-open-plugin) 和 [no-arg](no-arg-plugin) 相同，唯一的區別是 *sam-with-receiver* 沒有任何內建預設值，你需要指定你自己的特殊處理註解清單。

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

然後指定 SAM-with-receiver 註解的清單：

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

## Command-line compiler

將外掛程式 JAR 檔案新增到編譯器外掛程式類別路徑，並指定 sam-with-receiver 註解的清單：

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```