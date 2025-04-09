---
title: "Kotlin Metadata JVM 라이브러리"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 라이브러리는 JVM용으로 컴파일된 Kotlin 클래스에서 메타데이터를 읽고, 수정하고, 생성하는 도구를 제공합니다.
이 메타데이터는 `.class` 파일 내의 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 어노테이션에 저장되며,
[`kotlin-reflect`](reflection)와 같은 라이브러리 및 도구에서 런타임 시 속성, 함수,
클래스와 같은 Kotlin 관련 구조를 검사하는 데 사용됩니다.

:::note
`kotlin-reflect` 라이브러리는 런타임 시 Kotlin 관련 클래스 세부 정보를 검색하기 위해 메타데이터에 의존합니다.
메타데이터와 실제 `.class` 파일 간의 불일치는 리플렉션을 사용할 때 잘못된 동작으로 이어질 수 있습니다.

Kotlin Metadata JVM 라이브러리를 사용하여 가시성 또는 modality와 같은 다양한 선언 속성을 검사하거나 메타데이터를 생성하여 `.class` 파일에 포함할 수도 있습니다.

## 프로젝트에 라이브러리 추가

Kotlin Metadata JVM 라이브러리를 프로젝트에 포함하려면 빌드 도구에 따라 해당 종속성 구성을 추가하십시오.

Kotlin Metadata JVM 라이브러리는 Kotlin 컴파일러 및 표준 라이브러리와 동일한 버전 관리를 따릅니다.
사용하는 버전이 프로젝트의 Kotlin 버전과 일치하는지 확인하십시오.

:::

### Gradle

`build.gradle(.kts)` 파일에 다음 종속성을 추가하십시오.

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

`pom.xml` 파일에 다음 종속성을 추가하십시오.

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

## 메타데이터 읽기 및 파싱

`kotlin-metadata-jvm` 라이브러리는 클래스 이름, 가시성 및 시그니처와 같은 컴파일된 Kotlin `.class` 파일에서 구조화된 정보를 추출합니다.
컴파일된 Kotlin 선언을 분석해야 하는 프로젝트에서 사용할 수 있습니다.
예를 들어, [Binary Compatibility Validator (BCV)](https://github.com/Kotlin/binary-compatibility-validator)는 공개 API 선언을 인쇄하기 위해 `kotlin-metadata-jvm`에 의존합니다.

리플렉션을 사용하여 컴파일된 클래스에서 `@Metadata` 어노테이션을 검색하여 Kotlin 클래스 메타데이터 탐색을 시작할 수 있습니다.

```kotlin
fun main() {
    // 클래스의 정규화된 이름을 지정합니다.
    val clazz = Class.forName("org.example.SampleClass")

    // @Metadata 어노테이션을 검색합니다.
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // 메타데이터가 있는지 확인합니다.
    if (metadata != null) {
        println("This is a Kotlin class with metadata.")
    } else {
        println("This is not a Kotlin class.")
    }
}
```

`@Metadata` 어노테이션을 검색한 후에는 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API에서 [`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html) 함수 또는 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 함수 중 하나를 사용하여 파싱합니다.
이러한 함수는 다양한 호환성 요구 사항을 처리하면서 클래스 또는 파일에 대한 자세한 정보를 추출합니다.

* `readLenient()`: 최신 Kotlin 컴파일러 버전에서 생성된 메타데이터를 포함하여 메타데이터를 읽으려면 이 함수를 사용하십시오. 이 함수는 메타데이터 수정 또는 쓰기를 지원하지 않습니다.
* `readStrict()`: 메타데이터를 수정하고 써야 할 때 이 함수를 사용하십시오. `readStrict()` 함수는 프로젝트에서 완전히 지원하는 Kotlin 컴파일러 버전에서 생성된 메타데이터에서만 작동합니다.

    > `readStrict()` 함수는 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html)보다 최대 1개 버전까지의 메타데이터 형식을 지원하며, 이는 프로젝트에서 사용된 최신 Kotlin 버전에 해당합니다.
    > 예를 들어 프로젝트가 `kotlin-metadata-jvm:2.1.0`에 의존하는 경우 `readStrict()`는 Kotlin `2.2.x`까지의 메타데이터를 처리할 수 있습니다. 그렇지 않으면 알 수 없는 형식을 잘못 처리하지 않도록 오류가 발생합니다.
    > 
    > 자세한 내용은 [Kotlin Metadata GitHub 저장소](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe#detailed-explanation)를 참조하십시오. 
    >
    

메타데이터를 파싱할 때 `KotlinClassMetadata` 인스턴스는 클래스 또는 파일 수준 선언에 대한 구조화된 정보를 제공합니다.
클래스의 경우 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 속성을 사용하여 클래스 이름, 함수, 속성 및 가시성과 같은 속성과 같은 자세한 클래스 수준 메타데이터를 분석합니다.
파일 수준 선언의 경우 메타데이터는 Kotlin 컴파일러에서 생성된 파일 파사드에서 최상위 함수
및 속성을 포함하는 `kmPackage` 속성으로 표시됩니다.

다음 코드 예제는 `readLenient()`를 사용하여 메타데이터를 파싱하고, `kmClass`로 클래스 수준 세부 정보를 분석하고, `kmPackage`로 파일 수준 선언을 검색하는 방법을 보여줍니다.

```kotlin
// 필요한 라이브러리를 가져옵니다.
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 정규화된 클래스 이름을 지정합니다.
    val className = "org.example.SampleClass"

    try {
        // 지정된 이름에 대한 클래스 객체를 검색합니다.
        val clazz = Class.forName(className)

        // @Metadata 어노테이션을 검색합니다.
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // readLenient() 함수를 사용하여 메타데이터를 파싱합니다.
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class `->` {
                    val kmClass = metadata.kmClass
                    println("Class name: ${kmClass.name}")

                    // 함수를 반복하고 가시성을 확인합니다.
                    kmClass.functions.forEach { function `->`
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade `->` {
                    val kmPackage = metadata.kmPackage

                    // 함수를 반복하고 가시성을 확인합니다.
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

### 바이트코드에서 메타데이터 추출

리플렉션을 사용하여 메타데이터를 검색할 수 있지만, [ASM](https://asm.ow2.io/)과 같은 바이트코드 조작 프레임워크를 사용하여 바이트코드에서 메타데이터를 추출하는 또 다른 방법이 있습니다.

다음 단계를 수행하여 이 작업을 수행할 수 있습니다.

1. ASM 라이브러리의 `ClassReader` 클래스를 사용하여 `.class` 파일의 바이트코드를 읽습니다.
   이 클래스는 컴파일된 파일을 처리하고 클래스 구조를 나타내는 `ClassNode` 객체를 채웁니다.
2. `ClassNode` 객체에서 `@Metadata`를 추출합니다. 아래 예제에서는 이를 위해 사용자 정의 확장 함수 `findAnnotation()`을 사용합니다.
3. `KotlinClassMetadata.readLenient()` 함수를 사용하여 추출된 메타데이터를 파싱합니다.
4. `kmClass` 및 `kmPackage` 속성으로 파싱된 메타데이터를 검사합니다.

다음은 예제입니다.

```kotlin
// 필요한 라이브러리를 가져옵니다.
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// 어노테이션이 특정 이름을 참조하는지 확인합니다.
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// 키로 어노테이션 값을 검색합니다.
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// ClassNode에서 이름으로 어노테이션을 찾기 위해 사용자 정의 확장 함수를 정의합니다.
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// 어노테이션 값을 검색하는 것을 단순화하는 연산자
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// 클래스 노드에서 Kotlin 메타데이터를 추출합니다.
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

// 바이트코드 검사를 위해 파일을 ClassNode로 변환합니다.
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // 바이트코드를 읽고 ClassNode 객체로 처리합니다.
    val classNode = classFile.toClassNode()

    // @Metadata 어노테이션을 찾고 완화적으로 읽습니다.
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // 파싱된 메타데이터를 검사합니다.
        val kmClass = metadata.kmClass

        // 클래스 세부 정보를 인쇄합니다.
        println("Class name: ${kmClass.name}")
        println("Functions:")
        kmClass.functions.forEach { function `->`
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## 메타데이터 수정

[ProGuard](https://github.com/Guardsquare/proguard)와 같은 도구를 사용하여 바이트코드를 축소하고 최적화할 때 일부 선언이 `.class` 파일에서 제거될 수 있습니다.
ProGuard는 수정된 바이트코드와 일관성을 유지하기 위해 메타데이터를 자동으로 업데이트합니다.

그러나 유사한 방식으로 Kotlin 바이트코드를 수정하는 사용자 정의 도구를 개발하는 경우 메타데이터가 그에 따라 조정되는지 확인해야 합니다.
`kotlin-metadata-jvm` 라이브러리를 사용하면 선언을 업데이트하고, 속성을 조정하고, 특정 요소를 제거할 수 있습니다.

예를 들어 JVM 도구를 사용하여 Java 클래스 파일에서 개인 메서드를 삭제하는 경우 일관성을 유지하기 위해 Kotlin 메타데이터에서 개인 함수도 삭제해야 합니다.

1. `readStrict()` 함수를 사용하여 `@Metadata` 어노테이션을 구조화된 `KotlinClassMetadata` 객체로 로드하여 메타데이터를 파싱합니다.
2. `kmClass` 또는 다른 메타데이터 구조 내에서 직접 함수를 필터링하거나 속성을 변경하는 등 메타데이터를 조정하여 수정 사항을 적용합니다.
3. [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 함수를 사용하여 수정된 메타데이터를 새 `@Metadata` 어노테이션으로 인코딩합니다.

다음은 클래스 메타데이터에서 개인 함수를 제거하는 예제입니다.

```kotlin
// 필요한 라이브러리를 가져옵니다.
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 정규화된 클래스 이름을 지정합니다.
    val className = "org.example.SampleClass"

    try {
        // 지정된 이름에 대한 클래스 객체를 검색합니다.
        val clazz = Class.forName(className)

        // @Metadata 어노테이션을 검색합니다.
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // readStrict() 함수를 사용하여 메타데이터를 파싱합니다.
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // 클래스 메타데이터에서 개인 함수를 제거합니다.
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("Removed private functions. Remaining functions: ${kmClass.functions.map { it.name }}")

                // 수정된 메타데이터를 다시 직렬화합니다.
                val newMetadata = metadata.write()
                // 메타데이터를 수정한 후에는 클래스 파일에 써야 합니다.
                // 이렇게 하려면 ASM과 같은 바이트코드 조작 프레임워크를 사용할 수 있습니다.
                
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
`readStrict()` 및 `write()`를 별도로 호출하는 대신 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 함수를 사용할 수 있습니다.
이 함수는 메타데이터를 파싱하고, 람다를 통해 변환을 적용하고, 수정된 메타데이터를 자동으로 씁니다.

:::

## 처음부터 메타데이터 생성

Kotlin Metadata JVM 라이브러리를 사용하여 처음부터 Kotlin 클래스 파일에 대한 메타데이터를 만들려면 다음을 수행하십시오.

1. 생성하려는 메타데이터 유형에 따라 `KmClass`, `KmPackage` 또는 `KmLambda`의 인스턴스를 만듭니다.
2. 클래스 이름, 가시성, 생성자 및 함수 시그니처와 같은 속성을 인스턴스에 추가합니다.

    > 속성을 설정하는 동안 상용구 코드를 줄이기 위해 `apply()` [범위 함수](scope-functions)를 사용할 수 있습니다.
    >
    

3. 인스턴스를 사용하여 `@Metadata` 어노테이션을 생성할 수 있는 `KotlinClassMetadata` 객체를 만듭니다.
4. `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`와 같은 메타데이터 버전을 지정하고 플래그를 설정합니다(플래그가 없으면 `0`, 필요한 경우 기존 파일에서 플래그를 복사).
5. [ASM](https://asm.ow2.io/)의 `ClassWriter` 클래스를 사용하여 `kind`, `data1` 및 `data2`와 같은 메타데이터 필드를 `.class` 파일에 포함합니다.

다음 예제는 간단한 Kotlin 클래스에 대한 메타데이터를 만드는 방법을 보여줍니다.

```kotlin
// 필요한 라이브러리를 가져옵니다.
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // KmClass 인스턴스를 만듭니다.
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

    // 버전 및 플래그를 포함하여 KotlinClassMetadata.Class 인스턴스를 @kotlin.Metadata 어노테이션으로 직렬화합니다.
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // ASM으로 .class 파일을 생성합니다.
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // .class 파일에 @kotlin.Metadata 인스턴스를 씁니다.
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

    // 생성된 클래스 파일을 디스크에 씁니다.
    java.io.File("Hello.class").writeBytes(classBytes)

    println("Metadata and .class file created successfully.")
}
```

:::tip
자세한 예는 [Kotlin Metadata JVM GitHub 저장소](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43)를 참조하십시오.

:::

## 다음 단계

* [Kotlin Metadata JVM 라이브러리에 대한 API 참조를 참조하십시오](https://kotlinlang.org/api/kotlinx-metadata-jvm/).
* [Kotlin Metadata JVM GitHub 저장소를 확인하십시오](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm).
* [모듈 메타데이터 및 `.kotlin_module` 파일 작업에 대해 알아보십시오](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe#module-metadata).