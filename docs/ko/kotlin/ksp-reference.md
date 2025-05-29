[//]: # (title: Java 어노테이션 처리를 KSP로 매핑하기 위한 참조)

## 프로그램 요소

| **Java** | **KSP의 해당 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSP는 패키지를 프로그램 요소로 모델링하지 않습니다. |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## 타입

KSP는 명시적인 타입 분석을 요구하므로, Java의 일부 기능은 `KSType`과 분석 전 해당 요소들로만 수행될 수 있습니다.

| **Java** | **KSP의 해당 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | KSP에서 해당 없음 |
| `NullType` | | KSP에서 해당 없음 |
| `PrimitiveType` | `KSBuiltIns` | Java의 primitive type과 정확히 동일하지 않음 |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlin은 catch 블록당 하나의 타입만 가집니다. `UnionType`은 Java 어노테이션 프로세서에서도 관찰할 수 없습니다. |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## 기타

| **Java** | **KSP의 해당 기능** | **참고** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` | | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` | | |
| `TypeKind` | `KSBuiltIns` | 일부는 빌트인에서 찾을 수 있으며, 그렇지 않은 경우 `DeclaredType`에 대해서는 `KSClassDeclaration`을 확인하세요. |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` | | KSP에서 필요 없음 |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` | | |
| `TypeKindVisitor` | | |
| `Types` | `Resolver` / `utils` | 일부 `utils`는 심볼 인터페이스에도 통합되어 있습니다. |
| `Elements` | `Resolver` / `utils` | |

## 세부 사항

Java 어노테이션 처리 API의 기능을 KSP로 어떻게 수행할 수 있는지 알아보세요.

### AnnotationMirror

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)`는 `KSClassDeclaration`에서만 사용할 수 있습니다. 타입 인수를 제공해야 합니다. |
| `getAnnotation` | 구현 예정 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | 타입 확인 후 `ClassKind` 또는 `FunctionKind`에 따라 캐스팅 |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getDefaultValue` | 구현 예정 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin에서 필요 없음 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 상위 선언이 인터페이스인지 확인 |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 대응</b></td>
    </tr>
    <tr>
        <td><code>getEnclosedElements</code></td>
        <td><code>ksClassDeclaration.declarations</code></td>
    </tr>
    <tr>
        <td><code>getEnclosingElement</code></td>
        <td><code>ksClassDeclaration.parentDeclaration</code></td>
    </tr>
    <tr>
        <td><code>getInterfaces</code></td>
<td>

```kotlin
// 분석 없이도 가능해야 함
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td>`KSClassDeclaration.parentDeclaration`와 `inner` 한정자를 확인하세요.</td>
    </tr>
    <tr>
        <td><code>getQualifiedName</code></td>
        <td><code>ksClassDeclaration.qualifiedName</code></td>
    </tr>
    <tr>
        <td><code>getSimpleName</code></td>
        <td><code>ksClassDeclaration.simpleName</code></td>
    </tr>
    <tr>
        <td><code>getSuperclass</code></td>
<td>

```kotlin
// 분석 없이도 가능해야 함
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### TypeParameterElement

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getConstantValue` | 구현 예정 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

> 함수를 위한 `KSType`은 `FunctionN<R, T1, T2, ..., TN>` 계열로 표현되는 시그니처일 뿐입니다.
>
{style="note"}

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin에서 필요 없음 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `getKind` | 원시 타입, `Unit` 타입에 대해서는 `KSBuiltIns`의 타입들과 비교하고, 그렇지 않은 경우 선언된 타입들과 비교합니다. |

### TypeVariable

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 결정 예정. 캡처가 제공되고 명시적인 바운드 검사가 필요한 경우에만 필요합니다. |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 대응</b></td>
    </tr>
    <tr>
        <td><code>getExtendsBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
    <tr>
        <td><code>getSuperBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.CONTRAVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
</table>

### Elements

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 대응</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>, <code>getAllProperties</code>는 구현 예정</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>결정 예정, <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a>을 참조하세요.</td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>상수 값은 있지만 표현식은 없습니다.</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td>구현 예정</td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td>구현 예정</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>패키지는 지원되지 않지만, 패키지 정보는 가져올 수 있습니다. KSP에서는 패키지에 대한 작업이 불가능합니다.</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>패키지 지원 안 됨</td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>구현 예정</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code> (해당 클래스의 멤버 함수)</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP는 대부분의 클래스에 기본적인 <code>toString()</code> 구현을 제공합니다.</td>
    </tr>
</table>

### Types
{id="type-operations"}

| **Java** | **KSP 대응** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 필요 없음 |
| `capture` | 결정 예정 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | 컨텍스트에 따라 `KSType.markNullable`이 유용할 수 있습니다. |
| `getPrimitiveType` | 필요 없음, `KSBuiltins`를 확인하세요. |
| `getWildcardType` | `KSTypeArgument`가 예상되는 곳에 `Variance`를 사용하세요. |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 필요 없음 |