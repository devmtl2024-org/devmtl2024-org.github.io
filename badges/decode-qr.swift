import Foundation
import Vision
import AppKit

let path = CommandLine.arguments[1]
let scale = CommandLine.arguments.count > 2 ? Double(CommandLine.arguments[2])! : 1.0
let source = NSImage(contentsOfFile: path)!.cgImage(forProposedRect: nil, context: nil, hints: nil)!
let w = Int(Double(source.width) * scale), h = Int(Double(source.height) * scale)
let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.interpolationQuality = .medium
ctx.draw(source, in: CGRect(x: 0, y: 0, width: w, height: h))
let request = VNDetectBarcodesRequest()
try VNImageRequestHandler(cgImage: ctx.makeImage()!).perform([request])
let results = request.results ?? []
print("image \(w)x\(h) → \(results.count) code(s)")
for r in results { print(r.symbology.rawValue); print(r.payloadStringValue ?? "<nil>") }
