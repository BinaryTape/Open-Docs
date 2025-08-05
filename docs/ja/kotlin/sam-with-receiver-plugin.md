[//]: # (title: SAM-with-receiver コンパイラプラグイン)

*sam-with-receiver* コンパイラプラグインは、アノテーションが付けられたJavaの「単一抽象メソッド」(SAM)インターフェースのメソッドの最初のパラメータを、Kotlinのレシーバにします。この変換は、SAMインターフェースがKotlinラムダとして渡される場合にのみ機能し、SAMアダプタとSAMコンストラクタの両方で適用されます。(詳細については[SAM変換のドキュメント](java-interop.md#sam-conversions)を参照してください)。

例を次に示します。

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
        // ここで 'this' は 'Task' のインスタンスです

        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

## Gradle

使用方法は[all-open](all-open-plugin.md)および[no-arg](no-arg-plugin.md)と同じですが、sam-with-receiverには組み込みのプリセットがなく、独自に特別な扱いをするアノテーションのリストを指定する必要がある点が異なります。

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

次に、SAM-with-receiver アノテーションのリストを指定します。

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

プラグインのJARファイルをコンパイラプラグインのクラスパスに追加し、sam-with-receiver アノテーションのリストを指定します。

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver