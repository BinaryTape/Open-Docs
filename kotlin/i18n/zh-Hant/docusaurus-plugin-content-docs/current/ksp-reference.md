---
title: "Java 註解處理至 KSP 參考指南"
---
## 程式元素

| **Java** | **KSP 中最接近的設施** | **備註** |
| -------- | --------------------------- | --------- |
| `AnnotationMirror` | `KSAnnotation` | |
| `AnnotationValue` | `KSValueArguments` | |
| `Element` | `KSDeclaration` / `KSDeclarationContainer` | |
| `ExecutableElement` | `KSFunctionDeclaration` | |
| `PackageElement` | `KSFile` | KSP 不將 package 建模為程式元素 |
| `Parameterizable` | `KSDeclaration` | |
| `QualifiedNameable` | `KSDeclaration` | |
| `TypeElement` | `KSClassDeclaration` | |
| `TypeParameterElement` | `KSTypeParameter` | |
| `VariableElement` | `KSValueParameter` / `KSPropertyDeclaration` | |

## 類型 (Types)

KSP 需要顯式的類型解析 (type resolution)，因此 Java 中的某些功能只能在解析之前由 `KSType` 和相應的元素執行。

| **Java** | **KSP 中最接近的設施** | **備註** |
| -------- | --------------------------- | --------- |
| `ArrayType` | `KSBuiltIns.arrayType` | |
| `DeclaredType` | `KSType` / `KSClassifierReference` | |
| `ErrorType` | `KSType.isError` | |
| `ExecutableType` | `KSType` / `KSCallableReference` | |
| `IntersectionType` | `KSType` / `KSTypeParameter` | |
| `NoType` | `KSType.isError` | 在 KSP 中不適用 (N/A) |
| `NullType` | | 在 KSP 中不適用 (N/A) |
| `PrimitiveType` | `KSBuiltIns` | 與 Java 中的 primitive type 不完全相同 |
| `ReferenceType` | `KSTypeReference` | |
| `TypeMirror` | `KSType` | |
| `TypeVariable` | `KSTypeParameter` | |
| `UnionType` | N/A | Kotlin 每個 catch 塊只有一個類型。即使 Java annotation processor 也無法觀察到 `UnionType` |
| `WildcardType` | `KSType` / `KSTypeArgument` | |

## 其他 (Misc)

| **Java** | **KSP 中最接近的設施** | **備註** |
| -------- | --------------------------- | --------- |
| `Name` | `KSName` | |
| `ElementKind` | `ClassKind` / `FunctionKind` | |
| `Modifier` | `Modifier` | |
| `NestingKind` | `ClassKind` / `FunctionKind` | |
| `AnnotationValueVisitor` |  | |
| `ElementVisitor` | `KSVisitor` | |
| `AnnotatedConstruct` | `KSAnnotated` | |
| `TypeVisitor` |  | |
| `TypeKind` | `KSBuiltIns` | 有些可以在 builtins 中找到，否則檢查 `KSClassDeclaration` 以取得 `DeclaredType` |
| `ElementFilter` | `Collection.filterIsInstance` | |
| `ElementKindVisitor` | `KSVisitor` | |
| `ElementScanner` | `KSTopDownVisitor` | |
| `SimpleAnnotationValueVisitor` |  | 在 KSP 中不需要 |
| `SimpleElementVisitor` | `KSVisitor` | |
| `SimpleTypeVisitor` |  | |
| `TypeKindVisitor` |  | |
| `Types` | `Resolver` / `utils` | 有些 `utils` 也整合到 symbol 介面中 |
| `Elements` | `Resolver` / `utils` | |

## 詳情 (Details)

請參閱如何通過 KSP 執行 Java annotation processing API 的功能。

### AnnotationMirror

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues` | `ksAnnotation.arguments` |

### AnnotationValue

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getValue` | `ksValueArgument.value` |

### Element

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `asType` | `ksClassDeclaration.asType(...)` 僅適用於 `KSClassDeclaration`。需要提供類型參數。 |
| `getAnnotation` | 待實現 |
| `getAnnotationMirrors` | `ksDeclaration.annotations` |
| `getEnclosedElements` | `ksDeclarationContainer.declarations` |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration` |
| `getKind` | 類型檢查和轉換，遵循 `ClassKind` 或 `FunctionKind` |
| `getModifiers` | `ksDeclaration.modifiers` |
| `getSimpleName` | `ksDeclaration.simpleName` |

### ExecutableElement

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getDefaultValue` | 待實現 |
| `getParameters` | `ksFunctionDeclaration.parameters` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration` |
| `getReturnType` | `ksFunctionDeclaration.returnType` |
| `getSimpleName` | `ksFunctionDeclaration.simpleName` |
| `getThrownTypes` | Kotlin 中不需要 |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |
| `isDefault` | 檢查 parent declaration 是否為 interface |
| `isVarArgs` | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement
<table>
<tr>
<td>
<b>Java</b>
</td>
<td>
<b>KSP 等效項</b>
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
檢查 `KSClassDeclaration.parentDeclaration` 和 `inner` modifier
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

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement` | `ksTypeParameter.parentDeclaration` |

### VariableElement

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getConstantValue` | 待實現 |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName` | `ksValueParameter.simpleName` |

### ArrayType

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments` |

### ExecutableType

:::note
用於函數的 `KSType` 只是由 `FunctionN<R, T1, T2, ..., TN>` 系列表示的簽名 (signature)。

:::

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType` | `ksFunctionDeclaration.parentDeclaration.asType(...)` |
| `getReturnType` | `ksType.declaration.typeParameters.last()` |
| `getThrownTypes` | Kotlin 中不需要 |
| `getTypeVariables` | `ksFunctionDeclaration.typeParameters` |

### IntersectionType

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `getKind` | 比較 `KSBuiltIns` 中的類型以取得 primitive types，`Unit` 類型，否則為 declared types |

### TypeVariable

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `getLowerBound` | 待決定。僅當提供捕獲 (capture) 且需要顯式邊界檢查時才需要。 |
| `getUpperBound` | `ksTypeParameter.bounds` |

### WildcardType
<table>
<tr>
<td>
<b>Java</b>
</td>
<td>
<b>KSP 等效項</b>
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
<b>KSP 等效項</b>
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
`getAllFunctions`, `getAllProperties` 待實現
</td>
</tr>
<tr>
<td>
`getBinaryName`
</td>
<td>
待決定，請參閱 <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a>
</td>
</tr>
<tr>
<td>
`getConstantExpression`
</td>
<td>
存在 constant value，而非 expression
</td>
</tr>
<tr>
<td>
`getDocComment`
</td>
<td>
待實現
</td>
</tr>
<tr>
<td>
`getElementValuesWithDefaults`
</td>
<td>
待實現
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
Package 不受支援，但可以檢索 package 資訊。 KSP 無法對 package 進行操作
</td>
</tr>
<tr>
<td>
`getPackageOf`
</td>
<td>
Package 不受支援
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
待實現
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
`KSFunctionDeclaration.overrides` / `KSPropertyDeclaration.overrides` (各自類別的成員函數)
</td>
</tr>
<tr>
<td>
`printElements`
</td>
<td>
KSP 在大多數類別上都有基本的 `toString()` 實現
</td>
</tr>
</table>

### Types

| **Java** | **KSP 等效項** |
| -------- | ------------------ |
| `asElement` | `ksType.declaration` |
| `asMemberOf` | `resolver.asMemberOf` |
| `boxedClass` | 不需要 |
| `capture` | 待決定 |
| `contains` | `KSType.isAssignableFrom` |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes` |
| `erasure` | `ksType.starProjection()` |
| `getArrayType` | `ksBuiltIns.arrayType.replace(...)` |
| `getDeclaredType` | `ksClassDeclaration.asType` |
| `getNoType` | `ksBuiltIns.nothingType` / `null` |
| `getNullType` | 根據上下文，`KSType.markNullable` 可能很有用 |
| `getPrimitiveType` | 不需要，檢查 `KSBuiltins` |
| `getWildcardType` | 在需要 `KSTypeArgument` 的地方使用 `Variance` |
| `isAssignable` | `ksType.isAssignableFrom` |
| `isSameType` | `ksType.equals` |
| `isSubsignature` | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype` | `ksType.isAssignableFrom` |
| `unboxedType` | 不需要 |