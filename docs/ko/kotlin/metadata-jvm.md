[//]: # (title: Kotlin Metadata JVM 라이브러리)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 라이브러리는 JVM용으로 컴파일된 Kotlin 클래스의 메타데이터를 읽고, 수정하고, 생성하는 도구를 제공합니다. `.class` 파일 내의 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 어노테이션에 저장된 이 메타데이터는 [`kotlin-reflect`](reflection.md)와 같은 라이브러리 및 도구에서 런타임에 프로퍼티, 함수, 클래스와 같은 Kotlin 특정 구문(constructs)을 검사하는 데 사용됩니다.

> `kotlin-reflect` 라이브러리는 런타임에 Kotlin 특정 클래스 세부 정보를 검색하기 위해 메타데이터에 의존합니다.
> 메타데이터와 실제 `.class` 파일 간의 불일치는 리플렉션 사용 시 잘못된 동작을 유발할 수 있습니다.
> 
{style="warning"}

Kotlin Metadata JVM 라이브러리를 사용하여 가시성(visibility) 또는 모달리티(modality)와 같은 다양한 선언 속성을 검사하거나, 메타데이터를 생성하고 `.class` 파일에 임베드할 수도 있습니다.

## 프로젝트에 라이브러리 추가

프로젝트에 Kotlin Metadata JVM 라이브러리를 포함하려면 빌드 도구에 따라 해당 종속성 구성을 추가하세요.

> Kotlin Metadata JVM 라이브러리는 Kotlin 컴파일러 및 표준 라이브러리와 동일한 버전 관리를 따릅니다.
> 사용하려는 버전이 프로젝트의 Kotlin 버전과 일치하는지 확인하세요.
> 
{style="note"}

### Gradle

다음 종속성을 `build.gradle(.kts)` 파일에 추가하세요:

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-metadata-jvm:%kotlinVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-metadata-jvm:%kotlinVersion%'
}
```
</tab>
</tabs>

### Maven

다음 종속성을 `pom.xml` 파일에 추가하세요.

```xml
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-metadata-jvm</artifactId>
            <version>%kotlinVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```

## 메타데이터 읽기 및 파싱

`kotlin-metadata-jvm` 라이브러리는 컴파일된 Kotlin `.class` 파일에서 클래스 이름, 가시성(visibility), 시그니처와 같은 구조화된 정보를 추출합니다.
컴파일된 Kotlin 선언을 분석해야 하는 프로젝트에서 사용할 수 있습니다.
예를 들어, [바이너리 호환성 검증 도구(BCV)](https://github.com/Kotlin/binary-compatibility-validator)는 `kotlin-metadata-jvm`에 의존하여 공개 API 선언을 출력합니다.

리플렉션을 사용하여 컴파일된 클래스에서 `@Metadata` 어노테이션을 검색하여 Kotlin 클래스 메타데이터 탐색을 시작할 수 있습니다:

```kotlin
fun main() {
    // Specifies the fully qualified name of the class
    val clazz = Class.forName("org.example.SampleClass")

    // Retrieves the @Metadata annotation
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // Checks if the metadata is present
    if (metadata != null) {
        println("This is a Kotlin class with metadata.")
    } else {
        println("This is not a Kotlin class.")
    }
}
```

`@Metadata` 어노테이션을 검색한 후, [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API의 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 또는 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 함수를 사용하여 파싱하세요.
이 함수들은 서로 다른 호환성 요구 사항을 처리하면서 클래스 또는 파일에 대한 자세한 정보를 추출합니다:

*   `readLenient()`: 최신 Kotlin 컴파일러 버전에서 생성된 메타데이터를 포함하여 메타데이터를 읽는 데 이 함수를 사용하세요. 이 함수는 메타데이터를 수정하거나 쓰는 것을 지원하지 않습니다.
*   `readStrict()`: 메타데이터를 수정하고 써야 할 때 이 함수를 사용하세요. `readStrict()` 함수는 프로젝트에서 완전히 지원되는 Kotlin 컴파일러 버전에서 생성된 메타데이터에서만 작동합니다.

    > `readStrict()` 함수는 프로젝트에서 사용되는 최신 Kotlin 버전에 해당하는 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html)를 넘어 한 버전까지의 메타데이터 형식을 지원합니다.
    > 예를 들어, 프로젝트가 `kotlin-metadata-jvm:2.1.0`에 의존하는 경우, `readStrict()`는 Kotlin `2.2.x`까지의 메타데이터를 처리할 수 있습니다. 그렇지 않으면 알 수 없는 형식을 잘못 처리하는 것을 방지하기 위해 오류를 발생시킵니다.
    > 
    > 자세한 내용은 [Kotlin Metadata GitHub 리포지토리](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation)를 참조하세요. 
    >
    {style="note"}

메타데이터를 파싱할 때 `KotlinClassMetadata` 인스턴스는 클래스 또는 파일 수준 선언에 대한 구조화된 정보를 제공합니다.
클래스의 경우, [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 프로퍼티를 사용하여 클래스 이름, 함수, 프로퍼티, 가시성과 같은 속성 등 자세한 클래스 수준 메타데이터를 분석하는 데 사용하세요.
파일 수준 선언의 경우, 메타데이터는 `kmPackage` 프로퍼티에 의해 표현되며, 여기에는 Kotlin 컴파일러가 생성한 파일 파사드(file facades)의 최상위 함수 및 프로퍼티가 포함됩니다.

다음 코드 예시는 `readLenient()`를 사용하여 메타데이터를 파싱하고, `kmClass`로 클래스 수준 세부 정보를 분석하며, `kmPackage`로 파일 수준 선언을 검색하는 방법을 보여줍니다:

```kotlin
// Imports the necessary libraries
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // Specifies the fully qualified class name
    val className = "org.example.SampleClass"

    try {
        // Retrieves the class object for the specified name
        val clazz = Class.forName(className)

        // Retrieves the @Metadata annotation
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // Parses metadata using the readLenient() function
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class -> {
                    val kmClass = metadata.kmClass
                    println("Class name: ${kmClass.name}")

                    // Iterates over functions and checks visibility
                    kmClass.functions.forEach { function ->
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade -> {
                    val kmPackage = metadata.kmPackage

                    // Iterates over functions and checks visibility
                    kmPackage.functions.forEach { function ->
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                else -> {
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

### 메타데이터에 어노테이션 작성 및 읽기
<primary-label ref="experimental-general"/>

Kotlin 메타데이터에 어노테이션을 저장하고 `kotlin-metadata-jvm` 라이브러리를 사용하여 접근할 수 있습니다.
이렇게 하면 시그니처로 어노테이션을 일치시킬 필요가 없어지므로 오버로드된 선언에 대한 접근을 더 신뢰할 수 있게 만듭니다.

컴파일된 파일의 메타데이터에서 어노테이션을 사용할 수 있도록 하려면 다음 컴파일러 옵션을 추가하세요:

```kotlin
-Xannotations-in-metadata
```

또는 Gradle 빌드 파일의 `compilerOptions {}` 블록에 추가하세요:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

이 옵션을 활성화하면 Kotlin 컴파일러는 JVM 바이트코드와 함께 메타데이터에 어노테이션을 작성하여 `kotlin-metadata-jvm` 라이브러리가 이에 접근할 수 있게 만듭니다.

이 라이브러리는 어노테이션에 접근하기 위한 다음 API를 제공합니다:

*   `KmClass.annotations`
*   `KmFunction.annotations`
*   `KmProperty.annotations`
*   `KmConstructor.annotations`
*   `KmPropertyAccessorAttributes.annotations`
*   `KmValueParameter.annotations`
*   `KmFunction.extensionReceiverAnnotations`
*   `KmProperty.extensionReceiverAnnotations`
*   `KmProperty.backingFieldAnnotations`
*   `KmProperty.delegateFieldAnnotations`
*   `KmEnumEntry.annotations`

이 API는 [실험적](components-stability.md#stability-levels-explained)입니다.
옵트인하려면 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 어노테이션을 사용하세요.

다음은 Kotlin 메타데이터에서 어노테이션을 읽는 예시입니다:

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> 프로젝트에서 `kotlin-metadata-jvm` 라이브러리를 사용하는 경우, 어노테이션을 지원하도록 코드를 업데이트하고 테스트하는 것을 권장합니다.
> 그렇지 않으면 향후 Kotlin 버전에서 메타데이터의 어노테이션이 [기본적으로 활성화](https://youtrack.jetbrains.com/issue/KT-75736)될 때 프로젝트에서 유효하지 않거나 불완전한 메타데이터를 생성할 수 있습니다.
>
> 문제가 발생하면 [이슈 트래커](https://youtrack.jetbrains.com/issue/KT-31857)에 보고해주세요.
>
{style="warning"}

### 바이트코드에서 메타데이터 추출

리플렉션을 사용하여 메타데이터를 검색할 수 있지만, 또 다른 접근 방식은 [ASM](https://asm.ow2.io/)과 같은 바이트코드 조작 프레임워크를 사용하여 바이트코드에서 이를 추출하는 것입니다.

다음 단계를 따르면 됩니다:

1.  ASM 라이브러리의 `ClassReader` 클래스를 사용하여 `.class` 파일의 바이트코드를 읽습니다. 이 클래스는 컴파일된 파일을 처리하고 클래스 구조를 나타내는 `ClassNode` 객체를 채웁니다.
2.  `ClassNode` 객체에서 `@Metadata`를 추출합니다. 아래 예시는 이를 위해 사용자 지정 확장 함수 `findAnnotation()`을 사용합니다.
3.  `KotlinClassMetadata.readLenient()` 함수를 사용하여 추출된 메타데이터를 파싱합니다.
4.  `kmClass` 및 `kmPackage` 프로퍼티로 파싱된 메타데이터를 검사합니다.

예시입니다:

```kotlin
// Imports the necessary libraries
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// Checks if an annotation refers to a specific name
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// Retrieves annotation values by key
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// Defines a custom extension function to locate an annotation by its name in a ClassNode
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// Operator to simplify retrieving annotation values
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// Extracts Kotlin metadata from a class node
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

// Converts a file to a ClassNode for bytecode inspection
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // Reads the bytecode and processes it into a ClassNode object
    val classNode = classFile.toClassNode()

    // Locates the @Metadata annotation and reads it leniently
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // Inspects the parsed metadata
        val kmClass = metadata.kmClass

        // Prints class details
        println("Class name: ${kmClass.name}")
        println("Functions:")
        kmClass.functions.forEach { function ->
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## 메타데이터 수정

[ProGuard](https://github.com/Guardsquare/proguard)와 같은 도구를 사용하여 바이트코드를 축소하고 최적화할 때, 일부 선언이 `.class` 파일에서 제거될 수 있습니다.
ProGuard는 수정된 바이트코드와 일관성을 유지하기 위해 메타데이터를 자동으로 업데이트합니다.

하지만 유사한 방식으로 Kotlin 바이트코드를 수정하는 사용자 지정 도구를 개발하는 경우, 메타데이터가 그에 따라 조정되는지 확인해야 합니다.
`kotlin-metadata-jvm` 라이브러리를 사용하면 선언을 업데이트하고, 속성을 조정하고, 특정 요소를 제거할 수 있습니다.

예를 들어, Java 클래스 파일에서 private 메서드를 삭제하는 JVM 도구를 사용하는 경우, 일관성을 유지하려면 Kotlin 메타데이터에서 private 함수도 삭제해야 합니다:

1.  `readStrict()` 함수를 사용하여 `@Metadata` 어노테이션을 구조화된 `KotlinClassMetadata` 객체로 로드하여 메타데이터를 파싱합니다.
2.  `kmClass` 또는 다른 메타데이터 구조 내에서 직접 함수를 필터링하거나 속성을 변경하는 등 메타데이터를 조정하여 수정 사항을 적용합니다.
3.  [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 함수를 사용하여 수정된 메타데이터를 새로운 `@Metadata` 어노테이션으로 인코딩합니다.

다음은 클래스의 메타데이터에서 private 함수가 제거되는 예시입니다:

```kotlin
// Imports the necessary libraries
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // Specifies the fully qualified class name
    val className = "org.example.SampleClass"

    try {
        // Retrieves the class object for the specified name
        val clazz = Class.forName(className)

        // Retrieves the @Metadata annotation
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // Parses metadata using the readStrict() function
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // Removes private functions from the class metadata
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("Removed private functions. Remaining functions: ${kmClass.functions.map { it.name }}")

                // Serializes the modified metadata back
                val newMetadata = metadata.write()
                // After modifying the metadata, you need to write it into the class file
                // To do so, you can use a bytecode manipulation framework such as ASM
                
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

> `readStrict()`와 `write()`를 별도로 호출하는 대신 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 함수를 사용할 수 있습니다.
> 이 함수는 메타데이터를 파싱하고, 람다를 통해 변환을 적용하며, 수정된 메타데이터를 자동으로 작성합니다.
> 
{style="tip"}

## 메타데이터를 처음부터 생성

Kotlin Metadata JVM 라이브러리를 사용하여 Kotlin 클래스 파일을 처음부터 생성하려면:

1.  생성하려는 메타데이터 유형에 따라 `KmClass`, `KmPackage` 또는 `KmLambda` 인스턴스를 생성합니다.
2.  클래스 이름, 가시성, 생성자, 함수 시그니처와 같은 속성을 인스턴스에 추가합니다.

    > `apply()` [스코프 함수](scope-functions.md)를 사용하여 프로퍼티를 설정하는 동안 상용구 코드를 줄일 수 있습니다.
    >
    {style="tip"}

3.  인스턴스를 사용하여 `@Metadata` 어노테이션을 생성할 수 있는 `KotlinClassMetadata` 객체를 생성합니다.
4.  `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`와 같은 메타데이터 버전을 지정하고, 플래그를 설정합니다(플래그 없음의 경우 `0` 또는 필요한 경우 기존 파일에서 플래그 복사).
5.  [ASM](https://asm.ow2.io/)의 `ClassWriter` 클래스를 사용하여 `kind`, `data1`, `data2`와 같은 메타데이터 필드를 `.class` 파일에 임베드합니다.

다음 예시는 간단한 Kotlin 클래스의 메타데이터를 생성하는 방법을 보여줍니다:

```kotlin
// Imports the necessary libraries
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // Creates a KmClass instance
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

    // Serializes a KotlinClassMetadata.Class instance, including the version and flags, into a @kotlin.Metadata annotation
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // Generates a .class file with ASM
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // Writes @kotlin.Metadata instance to the .class file
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

    // Writes the generated class file to disk
    java.io.File("Hello.class").writeBytes(classBytes)

    println("Metadata and .class file created successfully.")
}
```

> 더 자세한 예시는 [Kotlin Metadata JVM GitHub 리포지토리](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)를 참조하세요.
> 
{style="tip"}

## 다음 단계

*   [Kotlin Metadata JVM 라이브러리 API 참조](https://kotlinlang.org/api/kotlinx-metadata-jvm/)를 참조하세요.
*   [Kotlin Metadata JVM GitHub 리포지토리](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm)를 확인하세요.
*   [모듈 메타데이터 및 `.kotlin_module` 파일 작업](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata)에 대해 알아보세요.