[//]: # (title: SAM-with-receiver コンパイラプラグイン)

*sam-with-receiver* コンパイラプラグインは、アノテーションが付与されたJavaの「単一抽象メソッド (SAM)」インターフェースメソッドの最初のパラメータを、Kotlinのレシーバにします。この変換は、SAMインターフェースがKotlinのラムダとして渡される場合にのみ機能し、SAMアダプターとSAMコンストラクタの両方に適用されます（詳細については、[SAM変換のドキュメント](java-interop.md#sam-conversions)を参照してください）。

例を以下に示します。

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

使い方は[all-open](all-open-plugin.md)や[no-arg](no-arg-plugin.md)と同じですが、sam-with-receiverには組み込みのプリセットがないため、独自の特殊処理を行うアノテーションのリストを指定する必要があります。

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

次に、SAM-with-receiverアノテーションのリストを指定します。

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

## コマンドラインコンパイラ

プラグインのJARファイルをコンパイラのプラグインクラスパスに追加し、sam-with-receiverアノテーションのリストを指定します。

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver