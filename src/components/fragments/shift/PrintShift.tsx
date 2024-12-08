import { Button } from '@components/ui/button'
import { Printer } from 'lucide-react'
import React from 'react'

function PrintShift() {
    return (
        <Button
            type="button"
            variant="outline"
        // onClick={() => window.print()}
        >
            <Printer className="w-4 h-4 mr-2" />
            Print
        </Button>
    )
}

export default PrintShift
