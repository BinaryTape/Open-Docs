---
title: "Java 어노테이션 프로세싱을 KSP 참조로"
---
## 프로그램 요소

| **Java** | **KSP에서 가장 유사한 기능** | **Notes** |
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

## Types

KSP는 명시적인 타입 확인을 요구하므로, Java의 일부 기능은 확인 전 `KSType` 및 해당 요소로만 수행할 수 있습니다.

| **Java** | **KSP에서 가장 유사한 기능** | **Notes** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | KSP에는 해당 없음 |
| `NullType` | | KSP에는 해당 없음 |
| `PrimitiveType` | `KSBuiltIns` | Java의 기본 타입과 정확히 같지 않음 |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlin은 catch 블록당 하나의 타입만 가집니다. `UnionType`은 Java annotation processor에서도 관찰할 수 없습니다. |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## Misc

| **Java** | **KSP에서 가장 유사한 기능** | **Notes** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` |  | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` |  | |
| `TypeKind` | `KSBuiltIns` | 일부는 builtins에서 찾을 수 있으며, 그렇지 않으면 `DeclaredType`에 대해 `KSClassDeclaration`을 확인합니다. |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` |  | KSP에서는 필요하지 않음 |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` |  | |
| `TypeKindVisitor` |  | |
| `Types` | `Resolver` / `utils` | `utils`의 일부는 심볼 인터페이스에도 통합되어 있습니다. |
| `Elements` | `Resolver` / `utils` | |

## Details

Java annotation processing API의 기능이 KSP로 어떻게 수행될 수 있는지 확인하세요.

### AnnotationMirror

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)`는 `KSClassDeclaration`에만 사용할 수 있습니다. 타입 인수를 제공해야 합니다. |
| `getAnnotation` | 구현 예정 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | `ClassKind` 또는 `FunctionKind`에 따라 타입 확인 및 캐스팅 |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getDefaultValue` | 구현 예정 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin에서는 필요하지 않음 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 부모 선언이 인터페이스인지 확인 |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement
<table>
<tr>
<td>
<b>Java</b>
</td>
<td>
<b>KSP equivalent</b>
</td>
</tr>
<tr>
<td>
`getEnclosedElements`
</td>
<td>
`ksClassDeclaration.declarations`
</td>
</tr>
<tr>
<td>
`getEnclosingElement`
</td>
<td>
`ksClassDeclaration.parentDeclaration`
</td>
</tr>
<tr>
<td>
`getInterfaces`
</td>
<td>

```kotlin
// Should be able to do without resolution
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE }
```
</td>
</tr>
<tr>
<td>
`getNestingKind`
</td>
<td>
`KSClassDeclaration.parentDeclaration` 및 `inner` modifier 확인
</td>
</tr>
<tr>
<td>
`getQualifiedName`
</td>
<td>
`ksClassDeclaration.qualifiedName`
</td>
</tr>
<tr>
<td>
`getSimpleName`
</td>
<td>
`ksClassDeclaration.simpleName`
</td>
</tr>
<tr>
<td>
`getSuperclass`
</td>
<td>

```kotlin
// Should be able to do without resolution
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```
</td>
</tr>
<tr>
<td>
`getTypeParameters`
</td>
<td>
`ksClassDeclaration.typeParameters`
</td>
</tr>
</table>

### TypeParameterElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getConstantValue` | 구현 예정 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

:::note
함수에 대한 `KSType`은 `FunctionN<R, T1, T2, ..., TN>` family로 표현되는 시그니처입니다.

:::

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin에서는 필요하지 않음 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `getKind` | 기본 타입의 경우 `KSBuiltIns`의 타입과 비교하고, `Unit` 타입, 그렇지 않으면 선언된 타입 |

### TypeVariable

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 결정해야 함. capture가 제공되고 명시적 bound 확인이 필요한 경우에만 필요함. |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType
<table>
<tr>
<td>
<b>Java</b>
</td>
<td>
<b>KSP equivalent</b>
</td>
</tr>
<tr>
<td>
`getExtendsBound`
</td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```
</td>
</tr>
<tr>
<td>
`getSuperBound`
</td>
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
<td>
<b>Java</b>
</td>
<td>
<b>KSP equivalent</b>
</td>
</tr>
<tr>
<td>
`getAllAnnotationMirrors`
</td>
<td>
`KSDeclarations.annotations`
</td>
</tr>
<tr>
<td>
`getAllMembers`
</td>
<td>
`getAllFunctions`, `getAllProperties`는 구현 예정
</td>
</tr>
<tr>
<td>
`getBinaryName`
</td>
<td>
결정해야 함, <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a> 참조
</td>
</tr>
<tr>
<td>
`getConstantExpression`
</td>
<td>
상수 값이 있으며, 표현식은 아님
</td>
</tr>
<tr>
<td>
`getDocComment`
</td>
<td>
구현 예정
</td>
</tr>
<tr>
<td>
`getElementValuesWithDefaults`
</td>
<td>
구현 예정
</td>
</tr>
<tr>
<td>
`getName`
</td>
<td>
`resolver.getKSNameFromString`
</td>
</tr>
<tr>
<td>
`getPackageElement`
</td>
<td>
패키지는 지원되지 않지만, 패키지 정보를 검색할 수 있습니다. KSP에서는 패키지에 대한 작업이 불가능합니다.
</td>
</tr>
<tr>
<td>
`getPackageOf`
</td>
<td>
패키지는 지원되지 않습니다.
</td>
</tr>
<tr>
<td>
`getTypeElement`
</td>
<td>
`Resolver.getClassDeclarationByName`
</td>
</tr>
<tr>
<td>
`hides`
</td>
<td>
구현 예정
</td>
</tr>
<tr>
<td>
`isDeprecated`
</td>
<td>

```kotlin
KsDeclaration.annotations.any { 
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```
</td>
</tr>
<tr>
<td>
`overrides`
</td>
<td>
`KSFunctionDeclaration.overrides` / `KSPropertyDeclaration.overrides` (각 클래스의 멤버 함수)
</td>
</tr>
<tr>
<td>
`printElements`
</td>
<td>
KSP는 대부분의 클래스에서 기본적인 `toString()` 구현을 제공합니다.
</td>
</tr>
</table>

### Types

| **Java** | **KSP equivalent** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 필요 없음 |
| `capture` | 결정해야 함 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | 컨텍스트에 따라 `KSType.markNullable`이 유용할 수 있습니다. |
| `getPrimitiveType` | 필요 없음, `KSBuiltins`를 확인하십시오 |
| `getWildcardType` | `KSTypeArgument`가 예상되는 위치에서 `Variance`를 사용하십시오 |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 필요 없음 |