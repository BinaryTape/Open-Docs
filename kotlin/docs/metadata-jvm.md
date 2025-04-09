---
title: "Kotlin元数据 JVM 库"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 库提供了一些工具，用于读取、修改和生成从为 JVM 编译的 Kotlin 类中的元数据。
这些元数据存储在 `.class` 文件中的 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 注解中，
供诸如 [`kotlin-reflect`](reflection) 之类的库和工具在运行时检查 Kotlin 特定的结构，例如属性、函数
和类。

:::note
`kotlin-reflect` 库依赖元数据在运行时检索 Kotlin 特定的类详细信息。
元数据和实际的 `.class` 文件之间的任何不一致都可能导致使用反射时出现不正确的行为。

你还可以使用 Kotlin Metadata JVM 库来检查各种声明属性，例如可见性或模态，或生成元数据并将其嵌入到 `.class` 文件中。

## 将库添加到你的项目中

要将 Kotlin Metadata JVM 库包含在你的项目中，请根据你的构建工具添加相应的依赖配置。

Kotlin Metadata JVM 库遵循与 Kotlin 编译器和标准库相同的版本控制。
确保你使用的版本与你的项目的 Kotlin 版本匹配。

:::

### Gradle

将以下依赖项添加到你的 `build.gradle(.kts)` 文件中：

<Tabs groupId="build-tool">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-metadata-jvm:2.1.20")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-metadata-jvm:2.1.20'
}
```
</TabItem>
</Tabs>

### Maven

将以下依赖项添加到你的 `pom.xml` 文件中。

```xml
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-metadata-jvm</artifactId>
            <version>2.1.20</version>
        </dependency>
    </dependencies>
    ...
</project>
```

## 读取和解析元数据

`kotlin-metadata-jvm` 库从已编译的 Kotlin `.class` 文件中提取结构化信息，例如类名、可见性和签名。
你可以在需要分析已编译的 Kotlin 声明的项目中使用它。
例如，[二进制兼容性验证器 (Binary Compatibility Validator, BCV)](https://github.com/Kotlin/binary-compatibility-validator) 依赖于 `kotlin-metadata-jvm` 来打印公共 API 声明。

你可以通过使用反射从已编译的类中检索 `@Metadata` 注解来开始探索 Kotlin 类元数据：

```kotlin
fun main() {
    // 指定类的完全限定名
    val clazz = Class.forName("org.example.SampleClass")

    // 检索 @Metadata 注解
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // 检查元数据是否存在
    if (metadata != null) {
        println("This is a Kotlin class with metadata.")
    } else {
        println("This is not a Kotlin class.")
    }
}
```

检索 `@Metadata` 注解后，使用 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API 中的 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 或 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 函数来解析它。
这些函数提取关于类或文件的详细信息，同时满足不同的兼容性要求：

* `readLenient()`：使用此函数读取元数据，包括由较新 Kotlin 编译器版本生成的元数据。此函数不支持修改或写入元数据。
* `readStrict()`：当你需要修改和写入元数据时，请使用此函数。`readStrict()` 函数仅适用于由你的项目完全支持的 Kotlin 编译器版本生成的元数据。

    > `readStrict()` 函数支持最高到 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) 之前一个版本的元数据格式，它对应于项目中使用的最新 Kotlin 版本。
    > 例如，如果你的项目依赖于 `kotlin-metadata-jvm:2.1.0`，则 `readStrict()` 可以处理最高到 Kotlin `2.2.x` 的元数据；否则，它会抛出错误以防止错误处理未知格式。
    > 
    > 更多信息，请参见 [Kotlin Metadata GitHub 仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe#detailed-explanation)。 
    >
    

解析元数据时，`KotlinClassMetadata` 实例提供关于类或文件级别声明的结构化信息。
对于类，使用 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 属性来分析详细的类级别元数据，例如类名、函数、属性和诸如可见性之类的属性。
对于文件级别的声明，元数据由 `kmPackage` 属性表示，其中包括由 Kotlin 编译器生成的文件外观中的顶级函数和属性。

以下代码示例演示如何使用 `readLenient()` 来解析元数据，使用 `kmClass` 分析类级别详细信息，以及使用 `kmPackage` 检索文件级别声明：

```kotlin
// 导入必要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定完全限定的类名
    val className = "org.example.SampleClass"

    try {
        // 检索指定名称的类对象
        val clazz = Class.forName(className)

        // 检索 @Metadata 注解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // 使用 readLenient() 函数解析元数据
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class `->` {
                    val kmClass = metadata.kmClass
                    println("Class name: ${kmClass.name}")

                    // 迭代函数并检查可见性
                    kmClass.functions.forEach { function `->`
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade `->` {
                    val kmPackage = metadata.kmPackage

                    // 迭代函数并检查可见性
                    kmPackage.functions.forEach { function `->`
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                else `->` {
                    println("Unsupported metadata type: $metadata")
                }
            }
        } else {
            println("No Kotlin Metadata found for class: $className")
        }
    } catch (e: ClassNotFoundException) {
        println("Class not found: $className")
    } catch (e: Exception) {
        println("Error processing metadata: ${e.message}")
        e.printStackTrace()
    }
}
```

### 从字节码中提取元数据

虽然你可以使用反射来检索元数据，但另一种方法是使用字节码操作框架（例如 [ASM](https://asm.ow2.io/)）从字节码中提取它。

你可以通过以下步骤来做到这一点：

1. 使用 ASM 库的 `ClassReader` 类读取 `.class` 文件的字节码。
   此类处理已编译的文件并填充一个 `ClassNode` 对象，该对象表示类结构。
2. 从 `ClassNode` 对象中提取 `@Metadata`。下面的示例为此使用了一个自定义扩展函数 `findAnnotation()`。
3. 使用 `KotlinClassMetadata.readLenient()` 函数解析提取的元数据。
4. 使用 `kmClass` 和 `kmPackage` 属性检查已解析的元数据。

这是一个示例：

```kotlin
// 导入必要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// 检查注解是否引用特定名称
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// 按键检索注解值
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// 定义一个自定义扩展函数，用于在 ClassNode 中按名称查找注解
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// 运算符简化了检索注解值
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// 从类节点读取 Kotlin 元数据
fun ClassNode.readMetadataLenient(): KotlinClassMetadata? {
    val metadataAnnotation = findAnnotation("kotlin/Metadata", false) ?: return null
    @Suppress("UNCHECKED_CAST")
    val metadata = Metadata(
        kind = metadataAnnotation["k"] as Int?,
        metadataVersion = (metadataAnnotation["mv"] as List<Int>?)?.toIntArray(),
        data1 = (metadataAnnotation["d1"] as List<String>?)?.toTypedArray(),
        data2 = (metadataAnnotation["d2"] as List<String>?)?.toTypedArray(),
        extraString = metadataAnnotation["xs"] as String?,
        packageName = metadataAnnotation["pn"] as String?,
        extraInt = metadataAnnotation["xi"] as Int?
    )
    return KotlinClassMetadata.readLenient(metadata)
}

// 将文件转换为 ClassNode 以进行字节码检查
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // 读取字节码并将其处理为 ClassNode 对象
    val classNode = classFile.toClassNode()

    // 找到 @Metadata 注解并宽松地读取它
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // 检查已解析的元数据
        val kmClass = metadata.kmClass

        // 打印类详细信息
        println("Class name: ${kmClass.name}")
        println("Functions:")
        kmClass.functions.forEach { function `->`
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## 修改元数据

当使用诸如 [ProGuard](https://github.com/Guardsquare/proguard) 之类的工具来缩小和优化字节码时，一些声明可能会从 `.class` 文件中删除。
ProGuard 会自动更新元数据以使其与修改后的字节码保持一致。

但是，如果你正在开发一种以类似方式修改 Kotlin 字节码的自定义工具，则需要确保相应地调整元数据。
使用 `kotlin-metadata-jvm` 库，你可以更新声明、调整属性并删除特定元素。

例如，如果你使用 JVM 工具从 Java 类文件中删除私有方法，则还必须从 Kotlin 元数据中删除私有函数以保持一致性：

1. 通过使用 `readStrict()` 函数将 `@Metadata` 注解加载到结构化的 `KotlinClassMetadata` 对象中来解析元数据。
2. 通过直接在 `kmClass` 或其他元数据结构中调整元数据（例如过滤函数或更改属性）来应用修改。
3. 使用 [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 函数将修改后的元数据编码为新的 `@Metadata` 注解。

这是一个从类的元数据中删除私有函数的示例：

```kotlin
// 导入必要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定完全限定的类名
    val className = "org.example.SampleClass"

    try {
        // 检索指定名称的类对象
        val clazz = Class.forName(className)

        // 检索 @Metadata 注解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // 使用 readStrict() 函数解析元数据
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // 从类元数据中删除私有函数
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("Removed private functions. Remaining functions: ${kmClass.functions.map { it.name }}")

                // 序列化修改后的元数据
                val newMetadata = metadata.write()
                // 修改元数据后，你需要将其写入类文件
                // 为此，你可以使用诸如 ASM 之类的字节码操作框架
                
                println("Modified metadata: ${newMetadata}")
            } else {
                println("The metadata is not a class.")
            }
        } else {
            println("No Kotlin Metadata found for class: $className")
        }
    } catch (e: ClassNotFoundException) {
        println("Class not found: $className")
    } catch (e: Exception) {
        println("Error processing metadata: ${e.message}")
        e.printStackTrace()
    }
}
```

:::tip
你可以使用 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 函数，而不是分别调用 `readStrict()` 和 `write()`。
此函数解析元数据，通过 lambda 应用转换，并自动写入修改后的元数据。

:::

## 从头开始创建元数据

要使用 Kotlin Metadata JVM 库从头开始为 Kotlin 类文件创建元数据：

1. 创建 `KmClass`、`KmPackage` 或 `KmLambda` 的实例，具体取决于你要生成的元数据的类型。
2. 向实例添加属性，例如类名、可见性、构造函数和函数签名。

    > 你可以使用 `apply()` [作用域函数](scope-functions) 来减少设置属性时的样板代码。
    >
    

3. 使用该实例创建一个 `KotlinClassMetadata` 对象，该对象可以生成一个 `@Metadata` 注解。
4. 指定元数据版本，例如 `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`，并设置标志（`0` 表示没有标志，或者如果需要，从现有文件复制标志）。
5. 使用 [ASM](https://asm.ow2.io/) 中的 `ClassWriter` 类将元数据字段（例如 `kind`、`data1` 和 `data2`）嵌入到 `.class` 文件中。

以下示例演示如何为简单的 Kotlin 类创建元数据：

```kotlin
// 导入必要的库
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // 创建一个 KmClass 实例
    val klass = KmClass().apply {
        name = "Hello"
        visibility = Visibility.PUBLIC
        constructors += KmConstructor().apply {
            visibility = Visibility.PUBLIC
            signature = JvmMethodSignature("<init>", "()V")
        }
        functions += KmFunction("hello").apply {
            visibility = Visibility.PUBLIC
            returnType = KmType().apply {
                classifier = KmClassifier.Class("kotlin/String")
            }
            signature = JvmMethodSignature("hello", "()Ljava/lang/String;")
        }
    }

    // 将 KotlinClassMetadata.Class 实例（包括版本和标志）序列化为 @kotlin.Metadata 注解
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // 使用 ASM 生成 .class 文件
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // 将 @kotlin.Metadata 实例写入 .class 文件
        visitAnnotation("Lkotlin/Metadata;", true).apply {
            visit("mv", annotationData.metadataVersion)
            visit("k", annotationData.kind)
            visitArray("d1").apply {
                annotationData.data1.forEach { visit(null, it) }
                visitEnd()
            }
            visitArray("d2").apply {
                annotationData.data2.forEach { visit(null, it) }
                visitEnd()
            }
            visitEnd()
        }
        visitEnd()
    }.toByteArray()

    // 将生成的类文件写入磁盘
    java.io.File("Hello.class").writeBytes(classBytes)

    println("Metadata and .class file created successfully.")
}
```

:::tip
有关更详细的示例，请参见 [Kotlin Metadata JVM GitHub 仓库](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)。

:::

## 接下来做什么

* [查看 Kotlin Metadata JVM 库的 API 参考](https://kotlinlang.org/api/kotlinx-metadata-jvm/)。
* [查看 Kotlin Metadata JVM GitHub 仓库](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)。
* [了解模块元数据以及使用 `.kotlin_module` 文件](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe#module-metadata)。

  ```