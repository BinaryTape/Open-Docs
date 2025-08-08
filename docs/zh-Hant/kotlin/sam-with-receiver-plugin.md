[//]: # (title: SAM-with-receiver 編譯器外掛)

*sam-with-receiver* 編譯器外掛會將帶註解的 Java「單一抽象方法」(SAM) 介面方法的第一個參數在 Kotlin 中變成一個接收者。此轉換僅在 SAM 介面作為 Kotlin lambda 傳遞時有效，無論是對於 SAM 轉接器還是 SAM 建構函式皆是如此 (詳情請參閱 [SAM 轉換文件](java-interop.md#sam-conversions))。

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
        // 在這裡，'this' 是 Task 的一個實例

        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

## Gradle

其用法與 [all-open](all-open-plugin.md) 和 [no-arg](no-arg-plugin.md) 相同，差別在於 sam-with-receiver 沒有任何內建預設值，且你需要指定自己特別處理的註解清單。

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

將外掛 JAR 檔案加入編譯器外掛的類別路徑，並指定 sam-with-receiver 註解的清單：

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```